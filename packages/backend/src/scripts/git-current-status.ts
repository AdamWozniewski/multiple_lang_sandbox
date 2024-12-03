import { exec } from 'child_process';

export const getBranch = () => new Promise((resolve, reject) => {
  return exec('git rev-parse --abbrev-ref HEAD', (err, stdout) => {
    if (err)
      reject(`getBranch Error: ${err}`);
    else {
      resolve(stdout.trim());
    }
  });
});

export const getCommitHash = () => new Promise((resolve, reject) => {
  return exec('git rev-parse HEAD', (err, stdout) => {
    if (err)
      reject(`getBranch Error: ${err}`);
    else {
      resolve(stdout.trim());
    }
  });
});