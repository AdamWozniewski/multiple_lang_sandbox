import type { NextFunction, Request, Response } from 'express';
import QRCode from 'qrcode';
import { randomInt } from 'node:crypto';
import { logger } from '@utility/logger';
import passport from '@utility/passport.js';
import { UserService } from '@services/User-Service';
import { RoleService } from '@services/Role-Services';
import { MailerService } from '@services/Mailer-Service';
import { ServiceNames } from '@customTypes/service-names';
import jwt from 'jsonwebtoken';
import { config } from '@config';
import { LinkService } from '@services/Link-Service';
import { base64url, generateSecret, hashPassword, sha256Base64url } from '@utility/hash';
import type { IUser } from '@mongo/models/user';
import type { IRoleService } from '@interface/role-interface';
import { VerificationCodeService } from '@services/Verification-Code-Service';
import { v4 as uuidv4 } from 'uuid';
import { AttemptsStore } from '@utility/attempts';
import { LoginRequestDTO } from '../../dto/user.dto';
import { ATTEMPT_TYPE } from '@customTypes/qr-code-attemp-status';

const localUrl: string = `${config.appUrl}${config.port}`;
const userControllerLogger = logger(ServiceNames.UserService);

const controller: string = 'UserController';

enum EventLogin {
  USER_REGISTERED = 'user-registered',
  LOGIN = 'login',
  UPDATE_PROFILE = 'update-profile',
  USER_ACTIVATED = 'user-activated',
  USER_FORGOT_PASSWORD = 'user-forgot-password',
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
    res.render('pages/auth/register');
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
      userControllerLogger.info('User registered', {
        metadata: {
          ip: req.ip,
          message: 'User registered',
          email: req.body.email,
          controller,
          event: EventLogin.USER_REGISTERED,
        },
      });
      res
        .set('Content-Type', 'text/html')
        .render('pages/confirm/confirm-registration');
    } catch (error: any) {
      const renderedErrors: Record<string, string> = {};
      for (const [path, ve] of Object.entries(error.errors)) {
        renderedErrors[path] = (ve as any).message;
      }

      userControllerLogger.error('User registered failed', {
        metadata: {
          ip: req.ip,
          message: JSON.stringify(renderedErrors),
          email: req.body.email,
          controller,
          event: EventLogin.USER_REGISTERED,
        },
      });

      return res.render('pages/auth/register', {
        errors: renderedErrors,
        form: req.body,
      });
    }
  };

  /**
   * STANDARD-LOGIN
   */

  showLogin(_req: Request, res: Response) {
    res.render('pages/auth/login');
  }

  loginUser = async (req: Request, res: Response) => {
    try {
      const dto = new LoginRequestDTO(req.body);
      dto.validate();
      const user = await this.userService.findUserByEmail(dto.email);
      const userComparedPassword = user?.comparePassword(dto.password);
      if (!user || !userComparedPassword) {
        throw new Error('Błędny login lub hasło');
      }
      if (!user.activate) {
        throw new Error('Account not activated');
      }
      if (user.twoFactorAuthentication) {
        req.session.pending2FA = {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user?.roles,
        };
        // switch (user.twoFactorAuthenticationType) {
        //   case 'verification-code': return res.redirect('/verification/verification-code');
        //   case 'qr-code': return res.redirect('/verification/qr-code');
        //   case 'magic-link': return res.redirect('/verification/magic-link');
        //   case 'physical-key': return res.redirect('/verification/magic-link');
        //   case 'biometrics': return res.redirect('/verification/magic-link');
        // }
        if (user.twoFactorAuthenticationType === 'verification-code') {
          return res.redirect('/verification/verification-code');
        }
        if (user.twoFactorAuthenticationType === 'qr-code') {
          return res.redirect('/verification/qr-code');
        }
        if (user.twoFactorAuthenticationType === 'magic-link') {
          return res.redirect('/verification/magic-link');
        }
        // if (user.twoFactorAuthenticationType === 'physical-key') {
        //   return res.redirect('/verification/magic-link');
        // }
        // if (user.twoFactorAuthenticationType === 'biometrics') {
        //   return res.redirect('/verification/magic-link');
        // }
      }

      this.setSuccessLogin(req, res, user as IUser);
    } catch (error: any) {
      userControllerLogger.error('Login failed', {
        metadata: {
          ip: req.ip,
          message: error.message,
          email: req.body.email,
          controller,
          event: EventLogin.LOGIN,
        },
      });
      res.render('pages/auth/login', {
        errors: { message: error.message },
        form: req.body,
      });
    }
  };

  /**
   * VERIFICATION-CODE
   */

  verificationCode = async (req: Request, res: Response) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const user = req.session.pending2FA;
    if (!user) return res.redirect('/login');
    try {
      await this.verificationCodeService.createVerificationCode(user, code);
      await this.mailerService.send2FAVerificationCode(
        user.email as string,
        code,
      );
      res.render('pages/auth/email-code');
    } catch (error: any) {
      userControllerLogger.error('Login failed', {
        metadata: {
          ip: req.ip,
          message: error.message,
          email: req.body.email,
          controller,
          event: EventLogin.LOGIN,
        },
      });
      res.render('pages/auth/email-code', {
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
        return res.render('pages/auth/email-code', {
          errors: { message: 'Kod wygasł lub jest nieprawidłowy' },
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
      userControllerLogger.error('Login failed', {
        metadata: {
          ip: req.ip,
          message: error.message,
          email: req.body.email,
          controller,
          event: EventLogin.LOGIN,
        },
      });
      res.render('pages/auth/email-code', {
        errors: { message: error.message },
        form: req.body,
      });
    }
  };

  /**
   * QR-CODE
   * */
  qrVerification = async (req: Request, res: Response) => {
    const userId = String((req.session as any)?.pending2FA?._id || req.user?.id);
    if (!userId) throw new Error("Brak kontekstu użytkownika do QR-login");

    const attemptId = uuidv4();
    const now = Date.now();
    const ttlMs = 120_000;

    const secret = generateSecret();
    const secretHash = sha256Base64url(secret);

    AttemptsStore.save({
      attemptId,
      userId,
      code: randomInt(1000, 10000),
      status: ATTEMPT_TYPE.PENDING,
      createdAt: now,
      expiresAt: now + ttlMs,
      browserSessionId: req.sessionID,
      secretHash,
      pairedDeviceId: undefined,
      failCount: 0,
    } as any);

    const apiBase = process.env.PUBLIC_URL ?? "http://127.0.0.1:3000";

    const payload = { v: 1, api: apiBase, attemptId, secret };
    const payloadB64 = base64url(Buffer.from(JSON.stringify(payload), "utf8"));

    // const mobileUrl = `${apiBase}/verification/qr-code#p=${payloadB64}`;
    const mobileUrl = `${apiBase}/m/qr#p=${payloadB64}`;

    const qrDataUrl = await QRCode.toDataURL(mobileUrl);

    return res.render("pages/auth/qr-code", {
      qrDataUrl,
      attemptId,
      code: AttemptsStore.get(attemptId)?.code,
      ttlSeconds: 120,
      streamUrl: `/pl/verification/qr-code/stream/${attemptId}`,
    });
  };

  qrMobileFakePage = (_req: Request, res: Response) => {
    return res.render("pages/auth/qr-code-approve");
  };

  qrMobilePair = (req: Request, res: Response) => {
    const { attemptId, secret, deviceId } = req.body as { attemptId: string; secret: string; deviceId: string };
    const attempt = AttemptsStore.get(attemptId);

    if (!attempt) return res.status(404).json({ ok: false, reason: "attempt_not_found" });
    if (attempt.expiresAt <= Date.now()) return res.status(400).json({ ok: false, reason: ATTEMPT_TYPE.EXPIRED });
    if (attempt.status !== ATTEMPT_TYPE.PENDING) return res.status(400).json({ ok: false, reason: "not_pending", status: attempt.status });

    const hash = sha256Base64url(String(secret));
    if ((attempt as any).secretHash !== hash) {
      (attempt as any).failCount = ((attempt as any).failCount ?? 0) + 1;
      if ((attempt as any).failCount >= 5) attempt.status = ATTEMPT_TYPE.DENIED;
      return res.status(400).json({ ok: false, reason: "bad_secret" });
    }

    attempt.status = ATTEMPT_TYPE.PAIRED;

    (attempt as any).pairedDeviceId = String(deviceId || "fake-mobile");
    return res.json({ ok: true });
  };

  qrMobileApprove = (req: Request, res: Response) => {
    const { attemptId, deviceId } = req.body as { attemptId: string; deviceId: string };
    const attempt = AttemptsStore.get(attemptId);

    if (!attempt) return res.status(404).json({ ok: false, reason: "attempt_not_found" });
    if (attempt.expiresAt <= Date.now()) return res.status(400).json({ ok: false, reason: ATTEMPT_TYPE.EXPIRED });
    if (attempt.status !== ATTEMPT_TYPE.PAIRED) return res.status(400).json({ ok: false, reason: "not_paired", status: attempt.status });

    if ((attempt as any).pairedDeviceId !== String(deviceId)) return res.status(403).json({ ok: false, reason: "device_mismatch" });

    AttemptsStore.approve(attemptId);
    return res.json({ ok: true });
  };

  qrFinalize = async (req: Request, res: Response) => {
    const { attemptId } = req.body as { attemptId: string };
    const attempt = AttemptsStore.get(attemptId);

    if (!attempt) return res.status(400).json({ ok: false, reason: "attempt_not_found" });
    if (attempt.status !== ATTEMPT_TYPE.APPROVED) return res.status(400).json({ ok: false, reason: "not_approved" });
    if ((attempt as any).browserSessionId !== req.sessionID)  return res.status(403).json({ ok: false, reason: "session_mismatch" });

    const user = await this.userService.findUserById(attempt.userId);
    // this.setSuccessLogin(req, res, user as IUser);
    req.session.user = {
      _id: user?._id,
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      roles: user?.roles,
    };

    AttemptsStore.remove(attemptId);
    return res.json({ ok: true });
  };

  qrStream = (req: Request, res: Response) => {
    const { attemptId } = req.params;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const clearIntervals = () => {
      clearInterval(tick);
      clearInterval(ping);
    }

    const resEnd = (status?: string) => {
      res.write(`data: ${JSON.stringify({ status: status })}\n\n`);
      clearIntervals();
      res.end();
    }

    const initial = AttemptsStore.get(attemptId);
    res.write(`data: ${JSON.stringify({ status: initial?.status ?? "not_found" })}\n\n`);

    const ping = setInterval(() => res.write(": keep-alive\n\n"), 15000);

    const tick = setInterval(() => {
      const attempt = AttemptsStore.get(attemptId);
      if (!attempt) return;

      if (attempt.status !== ATTEMPT_TYPE.PENDING && attempt.status !== ATTEMPT_TYPE.PAIRED) {
        console.log("[SSE] status changed", { attemptId, status: attempt.status });
        resEnd(attempt.status);
      } else if (attempt.expiresAt <= Date.now()) {
        attempt.status = ATTEMPT_TYPE.EXPIRED;
        console.log("[SSE] expired", { attemptId });
        resEnd(ATTEMPT_TYPE.EXPIRED);
      }
    }, 1000);

    req.on("close", () => {
      console.log("[SSE] closed", { attemptId });
      clearIntervals()
    });
  };

  /**
   * MAGIC-LINK
   * */

  magicLinkPage = (_req: Request, res: Response) => {
    return res.render("pages/auth/magic-link");
  };

  magicLinkSendEmail = async (req: Request, res: Response) => {
    // const user = req.session.pending2FA || await this.userService.findUserByEmail(req.params.email);
    const user = await this.userService.findUserByEmail(req.body.email) ;
    // if (!user) {
    //   return res.render('pages/auth/resend-activate', { ok: false });
    // }
    const plain = await this.userService.generateMagicLinkToken(user!.id);
    const link = `${localUrl}/verification/magic-link/verification?id=${user.id}&link=${plain}`;
    await this.mailerService.sendMagicLinkEmail(user.email, link);
    return res.render("pages/auth/magic-link-send-confirm");
  }

  magicLingVerification = async (req: Request, res: Response) => {
    try {
      const { id, link } = req.query;
      const user = await this.userService.findUserById(id as string);
      // const user = await this.userService.activateUser(
      //   activation as string,
      //   token as string,
      // );
      const userComparedPassword = user?.comparePassword(link as string);
      const { id } = jwt.verify(link, config.jwtSecret);
      console.log(userComparedPassword, user);
      this.setSuccessLogin(req, res, user as IUser);
    } catch (error: any) {

    }
  }

  logout = async (req: Request, res: Response): Promise<void> => {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect(`/${req.language}/login`);
    });
  };

  showProfile(req: Request, res: Response) {
    res.status(200).render('pages/auth/profile', { form: req.session.user });
  }

  saveProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.updateUserProfile(
        req.session.user._id,
        {
          ...req.body,
          twoFactorAuthentication: req.body.twoFactorAuthentication === 'on',
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
      userControllerLogger.info('Update Profile', {
        metadata: {
          ip: req.ip,
          message: 'Update Profile',
          email: req.session.user?.email,
          controller,
          event: EventLogin.UPDATE_PROFILE,
        },
      });
      res.render('pages/auth/profile', { form: req.session.user });
    } catch (error: any) {
      userControllerLogger.error('Update Profile failed', {
        metadata: {
          ip: req.ip,
          message: error.message,
          email: req.session.user.email,
          controller,
          event: EventLogin.UPDATE_PROFILE,
        },
      });
      res.render('pages/auth/profile', {
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
      userControllerLogger.info('User activated', {
        metadata: {
          ip: req.ip,
          message: 'User activated',
          email: user.email,
          controller,
          event: EventLogin.USER_ACTIVATED,
        },
      });
      res.render('pages/confirm/confirm-account');
    } catch (error: any) {
      userControllerLogger.error('User Activated failed', {
        metadata: {
          ip: req.ip,
          message: 'User Activated failed',
          email: 'req.body.email',
          controller,
          event: EventLogin.USER_ACTIVATED,
        },
      });
      res.render('pages/utility/information-screen', {
        errors: { message: error.message },
        form: req.body,
      });
    }
  };

  showResendActivate = async (_: Request, res: Response) => {
    res.render('pages/auth/forgot-password');
  };

  resendActivate = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      return res.render('pages/auth/resend-activate', { ok: false });
    }
    const plain = await this.userService.generateActivationToken(user.id);
    const link = `${localUrl}/activate?activation=${user.id}&token=${plain}`;
    await this.mailerService.sendActivationEmail(user.email, link);

    return res
      .set('Content-Type', 'text/html')
      .render('pages/confirm/confirm-registration');
  };

  showForgotPassword = (_req: Request, res: Response) => {
    res.render('pages/auth/forgot-password');
  };

  forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      return res.render('pages/confirm/forgot-password-email-send-confirm');
    }

    const token = jwt.sign({ id: user.id }, config.jwtSecret, {
      expiresIn: '1h',
    });
    const resetLink = `${process.env.CLIENT_URL}/reset-forgot-password?token=${token}`;
    try {
      await this.linkService.createLink({
        type: 'forgot-password',
        url: resetLink,
        user,
      });
      userControllerLogger.info('Forgot Password Send', {
        metadata: {
          ip: req.ip,
          message: 'Forgot Password Send',
          email: req.body.email,
          controller,
          event: EventLogin.USER_FORGOT_PASSWORD,
        },
      });
      return res.render('pages/confirm/forgot-password-email-send-confirm');
    } catch (error: any) {
      userControllerLogger.error('Forgot Password Send Failed', {
        metadata: {
          ip: req.ip,
          message: 'Forgot Password Send',
          email: req.body.email,
          controller,
          event: EventLogin.USER_FORGOT_PASSWORD,
        },
      });
      res.render('pages/auth/login', {
        errors: { message: error.message },
        form: req.body,
      });
    }
  };

  showResetForgotPassword = async (req: Request, res: Response) => {
    res.render('pages/auth/reset-forgot-password.ejs', {
      token: req.query.token,
    });
  };

  resetForgotPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;

    if (!token) {
      return res.status(400).send('Token is required');
    }

    // if (password !== confirmPassword) {
    //   return res.status(400).send("Passwords do not match");
    // }

    try {
      const { id } = jwt.verify(token, config.jwtSecret);
      const user = await this.userService.findUserById(id);

      if (!user) {
        return res.status(404).send('User not found');
      }
      const hashedPassword = await hashPassword(password);
      await this.userService.updateUserProfile(id, {
        password: hashedPassword,
      });

      return res
        .set('Content-Type', 'text/html')
        .render('pages/confirm/password-changed-confirm.ejs');
    } catch (error: any) {
      res.status(400).render('pages/auth/reset-forgot-password.ejs', {
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
    userControllerLogger.info('Login Success', {
      metadata: {
        ip: req.ip,
        message: 'Login Success',
        email: req.body.email,
        controller,
        event: EventLogin.LOGIN,
      },
    });
    return res.redirect('/');
  }
}
