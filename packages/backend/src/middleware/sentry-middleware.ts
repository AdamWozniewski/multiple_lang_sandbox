import type { Request, Response, NextFunction } from "express";

export const sentryMiddleware = (
  _err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.statusCode = 500;
  res.end(res.sentry + "\n");
};
