import { config } from "@config";
import { PRODUCTION } from "@static/env";
import { doubleCsrf } from "csrf-csrf";
import type { NextFunction, Request, Response } from "express";

const PROD = config.env === PRODUCTION;

const { invalidCsrfTokenError, generateToken, doubleCsrfProtection } =
  doubleCsrf({
    getSecret: () => config.csrfToken,
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
    getCsrfTokenFromRequest: (req) => req.headers["x-csrf-token"],
    skipCsrfProtection: undefined,
  });

const csrfTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.locals.csrfToken = generateToken(req, res);
  console.log("Generated CSRF Token:", res.locals.csrfToken);
  next();
};

const handleCsrfErrors = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err === invalidCsrfTokenError) {
    res.status(403).json({ message: "Invalid CSRF token" });
  } else {
    next(err);
  }
};

export { csrfTokenMiddleware, doubleCsrfProtection, handleCsrfErrors };
