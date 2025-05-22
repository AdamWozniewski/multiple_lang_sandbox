import path from "node:path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { __dirname } from "./dirname.js";
import { LogService } from "@services/Log-Service.js";
import { config } from "../config.js";
import { DEVELOPMENT } from "@static/env.js";

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...info }) => {
    const metadata = info.metadata ? JSON.stringify(info.metadata) : "";
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${metadata}`;
  }),
);

export const logger = (service: string) =>
  winston.createLogger({
    level: "info",
    format: logFormat,
    defaultMeta: { service },
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
      new LogService({
        level: "info",
      }),
      ...(config.env === DEVELOPMENT
        ? [
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
              ),
            }),
          ]
        : []),
    ],
  });
