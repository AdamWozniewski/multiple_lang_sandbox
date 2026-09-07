import { config } from "@config";
import IORedis from "ioredis";

export const connection = new IORedis({
  host: config.redisHost,
  port: Number(config.redisPort),
  maxRetriesPerRequest: null,
});
