import type { NextFunction, Request, Response } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  points: 1000,
  duration: 1,
});

export const rateLimiterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  rateLimiter
    .consume(req?.ip as string)
    .then(() => next())
    .catch(() => res.status(429).send("Too many reqs"));
};
