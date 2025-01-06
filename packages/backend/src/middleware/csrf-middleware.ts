import { doubleCsrf } from "csrf-csrf";
import type { Request, Response, NextFunction } from "express";

const {
  invalidCsrfTokenError,
  generateToken,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: () => "YOUR_SECRET_KEY",
  cookieName: "__Host-csrf-token",
  cookieOptions: {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  },
  getTokenFromRequest: (req) => req.headers["x-csrf-token"] as string,
});

const csrfTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.locals.csrfToken = generateToken(req, res);
  next();
};

const handleCsrfErrors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err === invalidCsrfTokenError) {
    res.status(403).json({ message: "Invalid CSRF token" });
  } else {
    next(err);
  }
};

export { doubleCsrfProtection, csrfTokenMiddleware, handleCsrfErrors };