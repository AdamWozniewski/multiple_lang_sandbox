import { exec } from "node:child_process";
const fs = require('fs');
const path = require('path');

export const getBranch =  (p = process.cwd())=> {
  const gitHeadPath = `${p}/.git/HEAD`;

  return fs.existsSync(p) ?
    fs.existsSync(gitHeadPath) ?
      fs.readFileSync(gitHeadPath, 'utf-8').trim().split('/')[2] :
      getBranch(path.resolve(p, '..')) :
    false
};

export const getCommitHash = async () =>
  new Promise<string>((resolve, reject) => {
    return exec("git rev-parse HEAD", (err, stdout) => {
      if (err) reject(`getBranch Error: ${err}`);
      else resolve(stdout.trim());
    });
  });
