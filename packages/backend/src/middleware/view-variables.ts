import type { NextFunction, Request, Response } from "express";

export const globalMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.locals.url = req.url;
  res.locals.errors = null;
  res.locals.form = {};
  res.locals.query = req.query;
  next();
};
