import type { NextFunction, Request, Response } from "express";
import type { Role } from "@customTypes/roles.js";

export const rolesMiddleware =
  (role: Role) => (req: Request, res: Response, next: NextFunction) => {
    if (req?.session?.user?.roles?.role.find((item: Role) => item === role))
      return next();
    return res.redirect(`/${req.language}/404`);
  };
