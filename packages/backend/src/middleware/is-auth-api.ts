import type { NextFunction, Request, Response } from "express";
import { config } from '../config.js';
import jwt from 'jsonwebtoken';

export const isAuthMiddlewareJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send({ message: "Brak tokena" });
    return
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload: any = jwt.verify(token, config.jwtSecret);

    const now = Date.now() / 1000;
    if (payload.exp - now < 300) {
      const newToken = jwt.sign(payload.userId, config.jwtRefreshSecret, { expiresIn: '1h' });
      res.setHeader("X-Access-Token", newToken);
    }

    req.user = payload;
    next();
  } catch (err) {
    res.status(401).send({ message: "Token wygasł lub jest nieprawidłowy" });
    return
  }
};