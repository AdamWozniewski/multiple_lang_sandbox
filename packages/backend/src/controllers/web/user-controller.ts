import type { Request, Response } from "express";
import { logger } from "../../services/logger.js";
// import { db } from '@sql/db.js';
// import { userTable } from '@sql/models/index.js';
import { UserService } from "../../services/User-Service.js";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register(_req: Request, res: Response) {
    res.render("pages/auth/register", {});
  }

  registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.userService.createUser(req.body);
      logger.info("User registered", { ip: req.ip });
      res.redirect("/");
    } catch (error: any) {
      logger.error("Error registering user", {
        ip: req.ip,
        error: error.message,
      });
      res.render("pages/auth/register", {
        errors: { email: { message: error.message } },
        form: req.body,
      });
    }
  };

  showLogin(_req: Request, res: Response) {
    res.render("pages/auth/login", {});
  }

  loginUser = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.findUserByEmail(req.body.email);
      if (!user || !user.comparePassword(req.body.password)) {
        throw new Error("Błędny login lub hasło");
      }
      if (!user.activate) {
        throw new Error("Account not activated");
      }
      req.session.user = { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName };
      res.redirect("/");
    } catch (error: any) {
      logger.error("Login failed", { ip: req.ip, error: error.message });
      res.render("pages/auth/login", {
        errors: { message: error.message },
        form: req.body,
      });
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    await req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect("/login");
    });
  };

  showProfile(req: Request, res: Response) {
    console.log(req.session.user);
    res.render("pages/auth/profile", { form: req.session.user });
  }

  saveProfile = async (req: Request, res: Response): Promise<void> => {
    // const user = await User.findById(req.session.user._id);
    // user!.email = req.body.email;
    // user!.firstName = req.body.firstName;
    // user!.lastName = req.body.lastName;
    // if (req.body.password) {
    //   user!.password = req.body.password;
    // }
    // try {
    //   await user!.save();
    //   req.session.user = user;
    //   logger.info("saveProfile", { ip: req.body.ip });
    //   res.redirect("/admin/profile"); // to oznacza: wróc skąd przyszedłeś
    // } catch (error: any) {
    //   logger.error("Error saveProfile", {
    //     ip: req.body.ip,
    //     stack: error.stack,
    //   });
    //   res.render("pages/auth/profile", {
    //     errors: error.errors,
    //     form: req.body,
    //   });
    // }
    try {
      const user = await this.userService.updateUserProfile(
        req.session.user._id,
        req.body,
      );
      req.session.user = { _id: user?._id, email: user?.email };
      res.redirect("/admin/profile");
    } catch (error: any) {
      logger.error("Error saving profile", {
        ip: req.ip,
        error: error.message,
      });
      res.render("pages/auth/profile", {
        errors: error.errors,
        form: req.body,
      });
    }
  };

  activateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, id } = req.params;
      await this.userService.activateUser(id, token);
      res.redirect("/login");
    } catch (error: any) {
      logger.error("Not activated", { ip: req.ip, error: error.message });
      res.render("pages/auth/login", {
        errors: { message: error.message },
        form: req.body,
      });
    }
  };
}
