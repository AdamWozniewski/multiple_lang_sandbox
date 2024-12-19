import { User } from "@mongo/models/user.js";
import { db } from "@sql/db.js";
import { userTable } from "@sql/models/index.js";
import type { Request, Response } from "express";
import { hashPassword } from "../../services/hash.js";
import { logger } from "../../services/logger.js";

export class UserController {
  register(_req: Request, res: Response) {
    res.render("pages/auth/register", {});
  }

  async registerUser(req: Request, res: Response) {
    // const user = new User(req.body); // MongoDB
    try {
      // await user.save(); // MongoDB
      const password = hashPassword(req.body.password);
      await db.insert(userTable).values({
        email: req.body.email,
        password,
      });
      logger.info("registerUser", { ip: req.body.ip });
      res.redirect("/");
    } catch (error: any) {
      logger.error("Error registerUser", {
        ip: req.body.ip,
        stack: error.stack,
      });
      console.log(error);
      res.render("pages/auth/register", {
        errors: {
          email: {
            message: "ten amejl jest zajęty",
          },
        },
        form: req.body,
      });
    }
  }

  showLogin(_req: Request, res: Response) {
    res.render("pages/auth/login", {});
  }

  async loginUser(req: Request, res: Response) {
    try {
      const user = await User.findOne({
        email: req.body.email,
      });
      if (!user) {
        throw new Error("User does not exist");
      }
      const isValidPassword = user.comparePassword(req.body.password);
      if (!isValidPassword) {
        throw new Error("password not valid");
      }
      req.session.user = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      res.redirect("/");
    } catch (e: any) {
      console.log(e);
      res.render("pages/auth/login", { errors: e.errors, form: req.body });
    }
  }

  async logout(req: Request, res: Response) {
    await req.session.destroy(() => {});
    res.clearCookie("connect.sid");
    res.redirect("/login");
  }

  showProfile(req: Request, res: Response) {
    res.render("pages/auth/profile", { form: req.session.user });
  }

  async saveProfile(req: Request, res: Response) {
    const user = await User.findById(req.session.user._id);
    user!.email = req.body.email;
    user!.firstName = req.body.firstName;
    user!.lastName = req.body.lastName;
    if (req.body.password) {
      user!.password = req.body.password;
    }
    try {
      await user!.save();
      req.session.user = user;
      logger.info("saveProfile", { ip: req.body.ip });
      res.redirect("/admin/profile"); // to oznacza: wróc skąd przyszedłeś
    } catch (error: any) {
      logger.error("Error saveProfile", {
        ip: req.body.ip,
        stack: error.stack,
      });
      res.render("pages/auth/profile", {
        errors: error.errors,
        form: req.body,
      });
    }
  }
}
