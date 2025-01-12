Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
var winston_1 = require("winston");
var path_1 = require("path");
var winston_daily_rotate_file_1 = require("winston-daily-rotate-file");
var dirname_js_1 = require("./dirname.js");
var logFormat = winston_1.default.format.combine(
  winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston_1.default.format.printf((_a) => {
    var timestamp = _a.timestamp,
      level = _a.level,
      message = _a.message,
      metadata = _a.metadata;
    return ""
      .concat(timestamp, " [")
      .concat(level.toUpperCase(), "]: ")
      .concat(message, " ")
      .concat(metadata ? JSON.stringify(metadata) : "");
  }),
);
exports.logger = winston_1.default.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new winston_daily_rotate_file_1.default({
      filename: path_1.default.join(
        (0, dirname_js_1.__dirname)(import.meta.url),
        "../../logs",
        "application-%DATE%.log",
      ),
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
    }),
    new winston_1.default.transports.File({
      filename: path_1.default.join(
        (0, dirname_js_1.__dirname)(import.meta.url),
        "../../logs",
        "errors.log",
      ),
      level: "error",
    }),
    new winston_1.default.transports.Console({
      format: winston_1.default.format.combine(
        winston_1.default.format.colorize(),
        winston_1.default.format.simple(),
      ),
    }),
  ],
});
