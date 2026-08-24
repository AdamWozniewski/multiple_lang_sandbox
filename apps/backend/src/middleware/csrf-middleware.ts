import { config } from "@config";
import { PRODUCTION } from "@static/env";
import { doubleCsrf } from "csrf-csrf";
import type { NextFunction, Request, Response } from "express";

const PROD = config.env === PRODUCTION;

const { invalidCsrfTokenError, generateToken, doubleCsrfProtection } =
  doubleCsrf({
    getSecret: () => config.csrfSecret,
    getSessionIdentifier: (req) => req.session.id,
    cookieName: "___Host-psifi.x-csrf-token",
    cookieOptions: {
      httpOnly: true,
      sameSite: "strict",
      secure: PROD,
      path: "/",
    },
    size: 32,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
    getTokenFromRequest: (req) => req.body?._csrf ?? req.query?._csrf,
    skipCsrfProtection: (req) => req.path.startsWith("/dev"),
  });

const csrfTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.locals.csrfSecret = generateToken(req, res, false, false);
  next();
};

const handleCsrfErrors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
    if (req.path.startsWith("/api")) return next();
  if (err === invalidCsrfTokenError) res.status(403).json({ message: "Invalid CSRF token" });
  else next(err);
};

export { csrfTokenMiddleware, doubleCsrfProtection, handleCsrfErrors };
