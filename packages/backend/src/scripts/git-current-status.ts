import { exec } from "node:child_process";

export const getBranch = async () =>
  new Promise<string>((resolve, reject) => {
    return exec("git rev-parse --abbrev-ref HEAD", (err, stdout) => {
      if (err) reject(`getBranch Error: ${err}`);
      else resolve(stdout.trim());
    });
  });

export const getCommitHash = async () =>
  new Promise<string>((resolve, reject) => {
    return exec("git rev-parse HEAD", (err, stdout) => {
      if (err) reject(`getBranch Error: ${err}`);
      else resolve(stdout.trim());
    });
  });
