Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommitHash = exports.getBranch = void 0;
var child_process_1 = require("child_process");
var getBranch = () =>
  new Promise((resolve, reject) =>
    (0, child_process_1.exec)(
      "git rev-parse --abbrev-ref HEAD",
      (err, stdout) => {
        if (err) reject("getBranch Error: ".concat(err));
        else {
          resolve(stdout.trim());
        }
      },
    ),
  );
exports.getBranch = getBranch;
var getCommitHash = () =>
  new Promise((resolve, reject) =>
    (0, child_process_1.exec)("git rev-parse HEAD", (err, stdout) => {
      if (err) reject("getBranch Error: ".concat(err));
      else {
        resolve(stdout.trim());
      }
    }),
  );
exports.getCommitHash = getCommitHash;
