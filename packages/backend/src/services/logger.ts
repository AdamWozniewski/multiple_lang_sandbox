import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { __dirname } from "./dirname.js";

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, metadata }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${
      metadata ? JSON.stringify(metadata) : ""
    }`;
  }),
);

export const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new DailyRotateFile({
      filename: path.join(
        __dirname(import.meta.url),
        "../../logs",
        "application-%DATE%.log",
      ),
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
    }),

    new winston.transports.File({
      filename: path.join(
        __dirname(import.meta.url),
        "../../logs",
        "errors.log",
      ),
      level: "error",
    }),

    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});
