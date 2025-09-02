import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from '@config';
import { PRODUCTION } from "@static/env";
import { UserService } from "@services/User-Service";
import { RoleService } from "@services/Role-Services";
import { MailerService } from "@services/Mailer-Service";

export class UserControllerApi {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.findUserByEmail(req.body.email);
      if (!user || !user.comparePassword(req.body.password)) {
        throw new Error("Błędny login lub hasło");
      }
      if (!user.activate) {
        throw new Error("Account not activated");
      }
      const token = jwt.sign({ user }, config.jwtSecret, { expiresIn: "1h" });
      const refreshToken = jwt.sign({ user }, config.jwtRefreshSecret, {
        expiresIn: "1d",
      });
      res
        .status(200)
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
          secure: config.env === PRODUCTION,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .header("Authorization", token)
        .json({ token, user, refreshToken });
    } catch (error: any) {
      console.log(error);
      res.status(401).json({ message: "error" });
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(401).send("Access Denied. No refresh token provided.");
    }

    try {
      const payload: any = jwt.verify(refreshToken, config.jwtRefreshSecret);
      const newAccessToken = jwt.sign(payload, config.jwtSecret, {
        expiresIn: "1h",
      });
      const newRefreshToken = jwt.sign(payload, config.jwtRefreshSecret, {
        expiresIn: "1d",
      });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      res.send({ accessToken: newAccessToken });
    } catch (error) {
      return res.status(400).send("Invalid refresh token.");
    }
  };

  logoutUser = async (_: Request, res: Response): Promise<void> => {
    res.clearCookie("refreshToken");
  };
}
