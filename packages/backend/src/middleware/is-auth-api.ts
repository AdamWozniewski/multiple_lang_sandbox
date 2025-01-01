import type { NextFunction, Request, Response } from "express";
import { User } from '@mongo/models/user.js';

export const isAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.sendStatus(403).send({
      message: "brak dostępu",
    });
  }
  const user = await User.findOne({ apiToken: token });
  if (!user) {
    res.sendStatus(403).send({
      message: "brak dostępu",
    });
  }

  req.user = user;
  next();
};
