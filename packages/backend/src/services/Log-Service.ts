import Transport from "winston-transport";
import { Log } from '@mongo/models/log.js'; // Zakładam, że model znajduje się w models/Log.js

export class LogService extends Transport {

  log(info: any, callback: () => void) {
    const { timestamp, level, message, metadata } = info;
    const logEntry = new Log({
      timestamp,
      level,
      controller: metadata.controller || "unknown",
      event: metadata.event || "unknown",
      ip: metadata.ip || "unknown",
      message,
      email: metadata.email || undefined,
    });

    logEntry
      .save()
      .then(() => callback())
      .catch((err) => {
        console.error("Failed to save log to MongoDB:", err);
        callback();
      });
  }
}

