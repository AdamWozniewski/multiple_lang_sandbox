import { config } from "@config";
import IORedis from "ioredis";

export const connection = new IORedis(`localhost:${config.redisPort}`, {
  maxRetriesPerRequest: null,
});
