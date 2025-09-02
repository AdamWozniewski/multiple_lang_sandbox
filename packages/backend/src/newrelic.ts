import { config } from "./config.js";

exports.config = {
  app_name: [config.NEW_RELIC_APP_NAME],
  license_key: config.NEW_RELIC_API_KEY,
  logging: {
    level: "info",
  },
  distributed_tracing: {
    enabled: true,
  },
};
