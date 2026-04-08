import type { Request, Response, NextFunction } from "express";

export const sentryMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.statusCode = 500;
  console.error(err); // pokaż stack
  res.status(500).send(process.env.NODE_ENV === 'production'
    ? 'Internal Server Error'
    : `<pre>${err.stack}</pre>`);

  // const eventId = (res as any).sentry;
  // res.status(500).render("error", {
  //   title: "Ups! Coś poszło nie tak",
  //   eventId: process.env.NODE_ENV === "development" ? eventId : undefined,
  // });
};
