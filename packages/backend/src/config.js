Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var dotenv_1 = require("dotenv");
var git_current_status_js_1 = require("./scripts/git-current-status.js");
var process = require("node:process");
dotenv_1.default.config();
exports.config = {
  // GIT
  gitBranch: (0, git_current_status_js_1.getBranch)(),
  gitCommitHash: (0, git_current_status_js_1.getCommitHash)(),
  // ENV
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  ssl: process.env.SSL || false,
  // MONGO
  db:
    process.env.DATABASE ||
    "mongodb://"
      .concat(process.env.MONGO_DB_USER, ":")
      .concat(process.env.MONGO_DB_PASSWORD, "@")
      .concat(process.env.MONGO_DB_ADDRESS, "/")
      .concat(process.env.MONGO_DB_NAME, "?authSource=admin"),
  // SQL
  // SESSION
  secretSession: process.env.SESSION_SECRET || "",
  // JWT
  // Email
  emailSender: process.env.EMAIL_SENDER || "Adam W <adam.baaka@gmail.com>",
  emailHost: process.env.EMAIL_HOST || "smtp.ethereal.email",
  emailPort: process.env.EMAIL_PORT || 587,
};
