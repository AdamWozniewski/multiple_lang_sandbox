import type { NextFunction, Request, Response } from "express";
import QRCode from "qrcode";
import { randomInt } from "node:crypto";
import { logger } from "@utility/logger";
import passport from "@utility/passport.js";
import { UserService } from "@services/User-Service";
import { RoleService } from "@services/Role-Services";
import { MailerService } from "@services/Mailer-Service";
import { ServiceNames } from "@customTypes/service-names";
import jwt from "jsonwebtoken";
import { config } from '@config';
import { LinkService } from "@services/Link-Service";
import { hashPassword } from "@utility/hash";
import type { IUser } from "@mongo/models/user";
import type { IRoleService } from "@interface/role-interface";
import { VerificationCodeService } from "@services/Verification-Code-Service";
import { v4 as uuidv4 } from "uuid";
import type { LoginAttempt } from "@interface/qr-code-login-attemp";
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";

import { AttemptsStore } from "@utility/attempts";

const localUrl: string = `${config.appUrl}${config.port}`;
const userControllerLogger = logger(ServiceNames.UserService);
const url: string = "";

const PUBLIC_URL = "https://2096c84e8b61.ngrok-free.app";
// const QR_SECRET = process.env.QR_SECRET!;
// const QR_TTL_SECONDS = Number(process.env.QR_TTL_SECONDS || 120);
const RP_ID = "2096c84e8b61.ngrok-free.app";
const ORIGIN = "https://2096c84e8b61.ngrok-free.app";

const controller: string = "UserController";
enum EventLogin {
  USER_REGISTERED = "user-registered",
  LOGIN = "login",
  UPDATE_PROFILE = "update-profile",
  USER_ACTIVATED = "user-activated",
  USER_FORGOT_PASSWORD = "user-forgot-password",
}
export class UserController {
  private userService: UserService;
  private linkService: LinkService;
  private roleService: IRoleService;
  private verificationCodeService: VerificationCodeService;
  private readonly mailerService: MailerService;

  constructor() {
    this.mailerService = new MailerService();
    this.linkService = new LinkService(this.mailerService);
    this.userService = new UserService();
    this.roleService = new RoleService();
    this.verificationCodeService = new VerificationCodeService();
  }

  register(_req: Request, res: Response) {
    res.render("pages/auth/register");
  }

  registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const roles = await this.roleService.getDefaultUserRole();
      const user = await this.userService.createUser({ ...req.body, roles });
      const token = await this.userService.generateActivationToken(user.id);
      const activationLink = `${localUrl}/activate?activation=${user.id}&token=${token}`;
      await this.mailerService.sendActivationEmail(
        user.email as string,
        activationLink,
      );
      userControllerLogger.info("User registered", {
        metadata: {
          ip: req.ip,
          message: "User registered",
          email: req.body.email,
          controller,
          event: EventLogin.USER_REGISTERED,
        },
      });
      res
        .set("Content-Type", "text/html")
        .render("pages/confirm/confirm-registration");
    } catch (error: any) {
      const renderedErrors: Record<string, string> = {};
      for (const [path, ve] of Object.entries(error.errors)) {
        renderedErrors[path] = (ve as any).message;
      }

      userControllerLogger.error("User registered failed", {
        metadata: {
          ip: req.ip,
          message: JSON.stringify(renderedErrors),
          email: req.body.email,
          controller,
          event: EventLogin.USER_REGISTERED,
        },
      });

      return res.render("pages/auth/register", {
        errors: renderedErrors,
        form: req.body,
      });
    }
  };

  showLogin(_req: Request, res: Response) {
    res.render("pages/auth/login");
  }

  loginUser = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.findUserByEmail(req.body.email);
      const userComparedPassword = await user?.comparePassword(
        req.body.password,
      );
      if (!user || !userComparedPassword) {
        throw new Error("Błędny login lub hasło");
      }
      if (!user.activate) {
        throw new Error("Account not activated");
      }
      if (user.twoFactorAuthentication) {
        req.session.pending2FA = {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user?.roles,
        };
        if (user.twoFactorAuthenticationType === "verification-code") {
          return res.redirect("/verification/verification-code");
        }
        if (user.twoFactorAuthenticationType === "qr-code") {
          return res.redirect("/verification/qr-code");
        }
      }

      this.setSuccessLogin(req, res, user as IUser);
    } catch (error: any) {
      userControllerLogger.error("Login failed", {
        metadata: {
          ip: req.ip,
          message: error.message,
          email: req.body.email,
          controller,
          event: EventLogin.LOGIN,
        },
      });
      res.render("pages/auth/login", {
        errors: { message: error.message },
        form: req.body,
      });
    }
  };
  /*
   * VERIFICATION-CODE
   * */
  verificationCode = async (req: Request, res: Response) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const user = req.session.pending2FA;
    if (!user) return res.redirect("/login");
    try {
      await this.verificationCodeService.createVerificationCode(user, code);
      await this.mailerService.send2FAVerificationCode(
        user.email as string,
        code,
      );
      res.render("pages/auth/email-code");
    } catch (error: any) {
      userControllerLogger.error("Login failed", {
        metadata: {
          ip: req.ip,
          message: error.message,
          email: req.body.email,
          controller,
          event: EventLogin.LOGIN,
        },
      });
      res.render("pages/auth/email-code", {
        errors: { message: error.message },
        form: req.body,
      });
    }
  };

  verificationCodeLogin = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { email } = req.session.pending2FA;
    const { code } = req.body;
    try {
      const record = await this.verificationCodeService.getVerificationCode(
        email,
        code,
      );
      if (!record) {
        return res.render("pages/auth/email-code", {
          errors: { message: "Kod wygasł lub jest nieprawidłowy" },
        });
      }

      await this.verificationCodeService.updateVerificationCode({
        email,
        code,
        used: true,
      });
      const user = await this.userService.findUserByEmail(email);
      this.setSuccessLogin(req, res, user as IUser);
    } catch (error: any) {
      userControllerLogger.error("Login failed", {
        metadata: {
          ip: req.ip,
          message: error.message,
          email: req.body.email,
          controller,
          event: EventLogin.LOGIN,
        },
      });
      res.render("pages/auth/email-code", {
        errors: { message: error.message },
        form: req.body,
      });
    }
  };

  /*
   * QR CODE
   * */

  qrVerification = async (req: Request, res: Response) => {
    try {
      const userId = String(
        (req.session as any)?.pending2FA._id || req.user?.id,
      );
      console.log(userId);
      if (!userId) throw new Error("Brak kontekstu użytkownika do QR-login");

      const attemptId = uuidv4();
      const code = randomInt(1000, 10000);
      const now = Date.now();
      const attempt: LoginAttempt = {
        attemptId,
        userId,
        code,
        status: "pending",
        createdAt: now,
        expiresAt: now + 120 * 1000,
      };
      AttemptsStore.save(attempt);

      const token = jwt.sign(
        { aid: attemptId, jti: uuidv4() },
        config.jwtSecret,
        { expiresIn: `${120}s` },
      );

      const approveUrl = `${PUBLIC_URL}/auth/approve?token=${encodeURIComponent(token)}`;

      const qrDataUrl = await QRCode.toDataURL(approveUrl);

      return res.render("pages/auth/qr-code", {
        qrDataUrl,
        attemptId,
        code,
        ttlSeconds: 120,
        streamUrl: `/auth/qr/stream/${attemptId}`,
      });
    } catch (error: any) {
      userControllerLogger.error("Login failed", {
        metadata: {
          ip: req.ip,
          message: error.message,
          email: req.body.email,
          controller,
          event: EventLogin.LOGIN,
        },
      });
      res.render("pages/auth/email-code", {
        errors: { message: error.message },
        form: req.body,
      });
    }
  };

  qrStream = (req: Request, res: Response) => {
    console.log("weszlo do qrStream");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const { attemptId } = req.params;
    const ping = setInterval(() => res.write(": keep-alive\n\n"), 15000);

    const tick = setInterval(() => {
      const a = AttemptsStore.get(attemptId);
      if (!a) return;
      if (a.status !== "pending") {
        res.write(`data: ${JSON.stringify({ status: a.status })}\n\n`);
        clearInterval(tick);
        clearInterval(ping);
        res.end();
      } else if (a.expiresAt <= Date.now()) {
        a.status = "expired";
        res.write(`data: ${JSON.stringify({ status: "expired" })}\n\n`);
        clearInterval(tick);
        clearInterval(ping);
        res.end();
      }
    }, 1000);

    req.on("close", () => {
      clearInterval(tick);
      clearInterval(ping);
    });
  };

  finalize = (req: Request, res: Response) => {
    console.log("weszlo do FINALIZE");
    const { attemptId } = req.body as { attemptId: string };
    const a = AttemptsStore.get(attemptId);
    if (!a || a.status !== "approved")
      return res.status(400).json({ ok: false });

    // TODO: utwórz właściwą sesję użytkownika (a.userId)
    (req.session as any).userId = a.userId;
    AttemptsStore.remove(attemptId);
    return res.json({ ok: true });
  };

  approvePage = (req: Request, res: Response) => {
    console.log("weszlo do approvedPAGE");
    const { token } = req.query as { token: string };
    return res.render("pages/auth/qr-code-approve", { token });
  };

  checkCode = (req: Request, res: Response): any => {
    console.log("weszlo do CHECKCODE");
    const { token, code } = req.body as { token: string; code: string };
    try {
      const { aid } = jwt.verify(token, config.jwtSecret) as { aid: string };
      const a = AttemptsStore.get(aid);
      if (!a)
        return res.status(400).json({ ok: false, reason: "attempt_not_found" });
      if (a.expiresAt <= Date.now())
        return res.status(400).json({ ok: false, reason: "expired" });
      if (a.status !== "pending")
        return res
          .status(400)
          .json({ ok: false, reason: "not_pending", status: a.status });
      if (String(a.code) !== String(code).trim())
        return res.status(400).json({ ok: false, reason: "code" });
      return res.json({ ok: true, attemptId: a.attemptId });
    } catch (err: any) {
      return res
        .status(400)
        .json({ ok: false, reason: "token", message: err.message });
    }
  };
  //
  webauthnOptions = async (req: Request, res: Response): any => {
    console.log("weszlo do WEBAUTHHNOPTIONS");
    const { attemptId } = req.body as { attemptId: string };
    const a = AttemptsStore.get(attemptId);

    if (!a)
      return res.status(400).json({ ok: false, reason: "attempt_not_found" });
    if (a.expiresAt <= Date.now())
      return res.status(400).json({ ok: false, reason: "expired" });
    if (a.status !== "pending")
      return res
        .status(400)
        .json({ ok: false, reason: "not_pending", status: a.status });

    // Bierzemy usera z próby (dev-friendly). W produkcji możesz zamiast tego wymagać req.user.id === a.userId
    const creds = await this.getUserCredentials(a.userId); // lista credentiali użytkownika z DB
    if (!creds?.length)
      return res.status(400).json({ ok: false, reason: "no_credentials" });

    const allowCredentials = creds.map((c) => ({
      id: Buffer.from(c.credentialID, "base64url"), // credentialID z DB w base64url
      type: "public-key" as const,
      transports: ["internal"] as const,
    }));

    const options = generateAuthenticationOptions({
      rpID: process.env.RP_ID!,
      allowCredentials,
      userVerification: "required",
      timeout: 60_000,
    });

    await this.saveAttemptChallenge(attemptId, options.challenge);
    return res.json(options); // zwracamy czyste options (200)
  };
  //
  webauthnVerify = async (req: Request, res: Response) => {
    console.log("weszlo do WEBAUTHVERIFY");
    const { attemptId, assertion } = req.body as {
      attemptId: string;
      assertion: any;
    };
    const a = AttemptsStore.get(attemptId);
    if (!a || a.status !== "pending")
      return res.status(400).json({ ok: false });

    const expectedChallenge = await this.loadAttemptChallenge(attemptId);
    const authenticator = await this.loadAuthenticatorForAssertion(
      assertion.id,
    ); // publicKey, counter, fmt

    const verification = await verifyAuthenticationResponse({
      response: assertion,
      expectedChallenge,
      expectedRPID: RP_ID,
      expectedOrigin: ORIGIN,
      authenticator,
      requireUserVerification: true,
    });

    if (!verification.verified) return res.status(400).json({ ok: false });

    await this.updateAuthenticatorCounter(
      assertion.id,
      verification.authenticationInfo.newCounter,
    );

    // Sukces: oznacz próbę jako approved
    AttemptsStore.approve(a.attemptId);
    return res.json({ ok: true });
  };

  async getUserCredentials(userId: string) {
    return [];
  }
  async saveAttemptChallenge(attemptId: string, ch: string) {
    /* noop */
  }
  async loadAttemptChallenge(attemptId: string) {
    return "";
  }
  async loadAuthenticatorForAssertion(credId: string) {
    return {
      // shape wymagany przez @simplewebauthn/server
      credentialID: Buffer.from(credId, "base64url"),
      credentialPublicKey: Buffer.alloc(0),
      counter: 0,
      transports: ["internal"] as "internal"[],
    };
  }
  async updateAuthenticatorCounter(credId: string, counter: number) {
    /* noop */
  }

  logout = async (req: Request, res: Response): Promise<void> => {
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect(`/${req.language}/login`);
    });
  };

  showProfile(req: Request, res: Response) {
    res.status(200).render("pages/auth/profile", { form: req.session.user });
  }

  saveProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.updateUserProfile(
        req.session.user._id,
        {
          ...req.body,
          twoFactorAuthentication: req.body.twoFactorAuthentication === "on",
          twoFactorAuthenticationType: req.body.twoFactorAuthenticationType,
        },
      );
      req.session.user = {
        _id: user?._id,
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
        twoFactorAuthentication: user?.twoFactorAuthentication,
        twoFactorAuthenticationType: user?.twoFactorAuthenticationType,
      };
      userControllerLogger.info("Update Profile", {
        metadata: {
          ip: req.ip,
          message: "Update Profile",
          email: req.session.user?.email,
          controller,
          event: EventLogin.UPDATE_PROFILE,
        },
      });
      res.render("pages/auth/profile", { form: req.session.user });
    } catch (error: any) {
      userControllerLogger.error("Update Profile failed", {
        metadata: {
          ip: req.ip,
          message: error.message,
          email: req.session.user.email,
          controller,
          event: EventLogin.UPDATE_PROFILE,
        },
      });
      res.render("pages/auth/profile", {
        errors: error.errors,
        form: req.body,
      });
    }
  };

  activateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, activation } = req.query;
      const user = await this.userService.activateUser(
        activation as string,
        token as string,
      );
      userControllerLogger.info("User activated", {
        metadata: {
          ip: req.ip,
          message: "User activated",
          email: user.email,
          controller,
          event: EventLogin.USER_ACTIVATED,
        },
      });
      res.render("pages/confirm/confirm-account");
    } catch (error: any) {
      userControllerLogger.error("User Activated failed", {
        metadata: {
          ip: req.ip,
          message: "User Activated failed",
          email: "req.body.email",
          controller,
          event: EventLogin.USER_ACTIVATED,
        },
      });
      res.render("pages/utility/information-screen", {
        errors: { message: error.message },
        form: req.body,
      });
    }
  };

  showResendActivate = async (_: Request, res: Response) => {
    res.render("pages/auth/forgot-password");
  };

  resendActivate = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      return res.render("pages/auth/resend-activate", { ok: false });
    }
    const plain = await this.userService.generateActivationToken(user.id);
    const link = `${localUrl}/activate?activation=${user.id}&token=${plain}`;
    await this.mailerService.sendActivationEmail(user.email, link);

    return res
      .set("Content-Type", "text/html")
      .render("pages/confirm/confirm-registration");
  };

  showForgotPassword = (_req: Request, res: Response) => {
    res.render("pages/auth/forgot-password");
  };

  forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      return res.render("pages/confirm/forgot-password-email-send-confirm");
    }

    const token = jwt.sign({ id: user.id }, config.jwtSecret, {
      expiresIn: "1h",
    });
    const resetLink = `${process.env.CLIENT_URL}/reset-forgot-password?token=${token}`;
    try {
      await this.linkService.createLink({
        type: "forgot-password",
        url: resetLink,
        user,
      });
      userControllerLogger.info("Forgot Password Send", {
        metadata: {
          ip: req.ip,
          message: "Forgot Password Send",
          email: req.body.email,
          controller,
          event: EventLogin.USER_FORGOT_PASSWORD,
        },
      });
      return res.render("pages/confirm/forgot-password-email-send-confirm");
    } catch (error: any) {
      userControllerLogger.error("Forgot Password Send Failed", {
        metadata: {
          ip: req.ip,
          message: "Forgot Password Send",
          email: req.body.email,
          controller,
          event: EventLogin.USER_FORGOT_PASSWORD,
        },
      });
      res.render("pages/auth/login", {
        errors: { message: error.message },
        form: req.body,
      });
    }
  };

  showResetForgotPassword = async (req: Request, res: Response) => {
    res.render("pages/auth/reset-forgot-password.ejs", {
      token: req.query.token,
    });
  };

  resetForgotPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;

    if (!token) {
      return res.status(400).send("Token is required");
    }

    // if (password !== confirmPassword) {
    //   return res.status(400).send("Passwords do not match");
    // }

    try {
      const { id } = jwt.verify(token, config.jwtSecret);
      const user = await this.userService.findUserById(id);

      if (!user) {
        return res.status(404).send("User not found");
      }
      const hashedPassword = await hashPassword(password);
      await this.userService.updateUserProfile(id, {
        password: hashedPassword,
      });

      return res
        .set("Content-Type", "text/html")
        .render("pages/confirm/password-changed-confirm.ejs");
    } catch (error: any) {
      res.status(400).render("pages/auth/reset-forgot-password.ejs", {
        errors: error.errors,
        form: req.body,
      });
    }
  };

  setSuccessLogin(req: Request, res: Response, user: IUser) {
    req.session.user = {
      _id: user?._id,
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      roles: user?.roles,
    };
    userControllerLogger.info("Login Success", {
      metadata: {
        ip: req.ip,
        message: "Login Success",
        email: req.body.email,
        controller,
        event: EventLogin.LOGIN,
      },
    });
    return res.redirect("/");
  }
}
