import type { NextFunction, Request, Response } from "express";

export const notIsAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.session.user) return res.redirect("/");
  next();
};
