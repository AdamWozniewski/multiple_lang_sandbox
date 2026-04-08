import type { NextFunction, Request, Response } from "express";
import { getBranch, getCommitHash } from '../scripts/git-current-status';

export const globalMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // const [branch, hash] = await Promise.all([getBranch(), getCommitHash()]);
  res.locals.url = req.url;
  res.locals.errors = null;
  res.locals.form = {};
  res.locals.query = req.query;
  res.locals.gitBranch = "branch || 'master'";
  res.locals.gitCommitHash = "hash || 'xxx'";
  next();
};
