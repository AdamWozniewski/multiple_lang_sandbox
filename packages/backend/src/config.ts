import dotenv from 'dotenv';
import { getBranch, getCommitHash } from './scripts/git-current-status.js';
import * as process from "node:process";

dotenv.config();

export const config = {
  // GIT
  gitBranch: getBranch(),
  gitCommitHash: getCommitHash(),

  // ENV
  env: process.env.NODE_ENV,
  port: process.env.PORT || 3000,
  ssl: process.env.SSL || false,

  // MONGO
  db: process.env.DATABASE || `mongodb://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_ADDRESS}/${process.env.MONGO_DB_NAME}?authSource=admin`,

  // SQL

  // SESSION
  secretSession: process.env.SESSION_SECRET || '',

  // JWT

  // Email
  emailSender: process.env.EMAIL_SENDER || 'Adam W <adam.baaka@gmail.com>',
  emailHost: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  emailPort: process.env.EMAIL_PORT || 587,
};