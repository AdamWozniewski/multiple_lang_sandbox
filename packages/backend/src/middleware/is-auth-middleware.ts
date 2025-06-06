import type { NextFunction, Request, Response } from "express";

export const isAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session.user) return res.redirect("/");
  next();
};
