import type { NextFunction, Request, Response } from "express";
import { logger } from "@utility/logger.js";
import passport from "@utility/passport.js";
import { UserService } from "@services/User-Service.js";
import { RoleService } from "@services/Role-Services.js";
import { MailerService } from "@services/Mailer-Service.js";
import { ServiceNames } from "@customTypes/service-names.js";
import jwt from "jsonwebtoken";
import { config } from "../../config.js";
import { LinkService } from "@services/Link-Service.js";
import { hashPassword } from "@utility/hash.js";

const localUrl: string = `${config.appUrl}${config.port}`;
const userControllerLogger = logger(ServiceNames.UserService);
const url: string = "";

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
  private readonly mailerService: MailerService;

  constructor() {
    const roleService = new RoleService();
    this.mailerService = new MailerService();
    this.linkService = new LinkService(this.mailerService);
    this.userService = new UserService(roleService);
  }

  register(_req: Request, res: Response) {
    res.render("pages/auth/register");
  }

  registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.createUser(req.body);
      const activationLink = `${localUrl}/activate?activation=${user.id}&token=${user.apiToken}`;
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
      userControllerLogger.error("User registered failed", {
        metadata: {
          ip: req.ip,
          message: error.message,
          email: req.body.email,
          controller,
          event: EventLogin.USER_REGISTERED,
        },
      });
      res.render("pages/auth/register", {
        errors: { email: { message: error.message } },
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

      req.session.user = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
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
      res.redirect("/");
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
        req.body,
      );
      req.session.user = {
        _id: user?._id,
        email: user?.email,
        firstName: user?.firstName,
        lastName: user?.lastName,
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
      userControllerLogger.info("User Activated failed", {
        metadata: {
          ip: req.ip,
          message: "User Activated failed",
          email: "req.body.email",
          controller,
          event: EventLogin.USER_ACTIVATED,
        },
      });
      res.render("pages/auth/login", {
        errors: { message: error.message },
        form: req.body,
      });
    }
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

  loginWithProvider = (req: Request, res: Response, next: NextFunction) => {
    const provider = req.params.provider;

    if (!["google", "facebook"].includes(provider)) {
      return res.status(400).send("Invalid provider");
    }

    const middleware = passport.authenticate(provider, {
      scope: provider === "google" ? ["email", "profile"] : ["email"],
    });

    return middleware(req, res, next);
  };

  oauthCallback = (req: Request, res: Response, next: NextFunction): void => {
    const provider = req.params.provider;

    if (!["google", "facebook"].includes(provider)) {
      res.status(400).send("Invalid provider");
    }

    passport.authenticate(provider, { failureRedirect: "/login" })(
      req,
      res,
      next,
    );
  };
}
