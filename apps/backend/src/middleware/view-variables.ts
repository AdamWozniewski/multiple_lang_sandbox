import type { NextFunction, Request, Response } from "express";
import { getBranch, getCommitHash } from "../scripts/git-current-status";

let gitInfoPromise: Promise<{
  gitBranch: string;
  gitCommitHash: string;
}> | null = null;

const getGitInfo = () => {
  gitInfoPromise ??= Promise.all([getBranch(), getCommitHash()]).then(
    ([branch, hash]) => ({
      gitBranch: branch || "master",
      gitCommitHash: hash || "xxx",
    }),
  );
  return gitInfoPromise;
};

export const globalMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.locals.url = req.url;
  res.locals.errors = null;
  res.locals.form = {};
  res.locals.query = req.query;
  if (process.env.NODE_ENV === "development") {
    Object.assign(res.locals, await getGitInfo());
  }
  next();
};
