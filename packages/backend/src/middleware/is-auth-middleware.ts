import { NextFunction, Request, Response } from 'express';

export const isAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) res.redirect('/');
  next();
};