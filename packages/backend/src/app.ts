import "./instrument.js";
import path from "path";
import * as Sentry from "@sentry/node";
import cookieParser from "cookie-parser";
// import { runDBAdmin } from "./db/sql/init.ts";
import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import expressSession from "express-session";
import { readFile } from "fs/promises";
import { serve, setup } from "swagger-ui-express";
import { config } from "./config.js";
import { isAuthMiddleware } from "./middleware/is-auth-middleware.js";
import { rateLimiterMiddleware } from "./middleware/rate-limiter-middleware.js";
import { userMiddleware } from "./middleware/user-middleware.js";
import { globalMiddleware } from "./middleware/view-variables.js";
import { routerApi } from "./routes/api.js";
// import './db/mongo/database.ts';
import { routerWeb } from "./routes/web.js";

import { routerDev } from "./routes/web-dev.js";
import { __dirname } from "./services/dirname.js";
import { DEVELOPMENT } from "./static/env.js";

export const startApp = async () => {
  const app = express();

  app.use(
    expressSession({
      secret: config.secretSession,
      saveUninitialized: true,
      cookie: {
        maxAge: 86400000,
      },
      resave: false,
    }),
  );

  const swaggerDocument = JSON.parse(
    (await readFile(new URL("./../docs/swagger.json", import.meta.url))) as any,
  );
  app.use("/api-docs", serve, setup(swaggerDocument));
  app.disable("etag");
  app.set("view engine", "ejs");
  app.use(expressEjsLayouts);
  app.set("views", path.join(__dirname(import.meta.url), "/views"));
  app.set("layout", "layouts/main");
  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(express.json());

  app.use(globalMiddleware);

  app.use(userMiddleware);
  // app.use(helmet({
  //     directives: {
  //         defaultSrc: ["'self'"],
  //         scriptSrc: ["'self'", "cdn.jsdelivr.net"],
  //         styleSrc: ["'self'", "cdn.jsdelivr.net"],
  //     }
  // }))

  app.use(rateLimiterMiddleware);
  app.use("/admin", isAuthMiddleware);
  // Routing
  app.use("/api", routerApi);
  if (config.env === DEVELOPMENT) app.use("/dev", routerDev);
  app.use(routerWeb);
  Sentry.setupExpressErrorHandler(app);
  app.use(function onError(_err: any, _req: any, res: any, _next: any) {
    res.statusCode = 500;
    res.end(`${res.sentry}\n`);
  });
  return app;
};
