import * as process from "node:process";
import dotenv from "dotenv";
import { getBranch, getCommitHash } from "./scripts/git-current-status.js";
import { DEVELOPMENT } from "./static/env.js";

dotenv.config();

export const config = {
  // GIT
  gitBranch: getBranch(),
  gitCommitHash: getCommitHash(),

  // ENV
  env: process.env.NODE_ENV || DEVELOPMENT,
  port: process.env.PORT || 3000,
  ssl: process.env.SSL || false,

  // MONGO
  db:
    process.env.DATABASE ||
    `mongodb://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_ADDRESS}/${process.env.MONGO_DB_NAME}?authSource=admin`,

  // SQL

  // SESSION
  secretSession: process.env.SESSION_SECRET || "",

  // JWT
  jwtSecret: process.env.JWT_SECRET || "",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "",

  // CSRF
  csrfToken: process.env.CSRF_TOKEN || "",

  // Email
  emailSender: process.env.EMAIL_SENDER || "Adam W <xx@xx.xx>",
  emailHost: process.env.EMAIL_HOST || "smtp.ethereal.email",
  emailPort: process.env.EMAIL_PORT || 587,

  // Monitoring
  sentryApiKey: process.env.SENTRY_API_KEY || "",
  sentryAuthToken: process.env.SENTRY_AUTH_TOKEN || "",
};
