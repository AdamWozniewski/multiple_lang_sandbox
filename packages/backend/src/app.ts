import "./instrument.js";
import path from "node:path";
import * as Sentry from "@sentry/node";
import cookieParser from "cookie-parser";
// import { runDBAdmin } from "./db/sql/init.ts";
import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import expressSession from "express-session";
import { readFile } from "node:fs/promises";
import { serve, setup } from "swagger-ui-express";
import { config } from "./config.js";
import { isAuthMiddleware } from "./middleware/is-auth-middleware.js";
import { rateLimiterMiddleware } from "./middleware/rate-limiter-middleware.js";
import { userMiddleware } from "./middleware/user-middleware.js";
import { globalMiddleware } from "./middleware/view-variables.js";
import { routerApi } from "./routes/api.js";
import "./db/mongo/database.ts";
import { routerWeb } from "./routes/web.js";
import { routerDev } from "./routes/web-dev.js";
import { __dirname } from "./utility/dirname.js";
import { DEVELOPMENT, PRODUCTION } from "./static/env.js";
import helmet from "helmet";
import i18next from "./i18n.js";
import { handle } from "i18next-http-middleware";
import { languageMiddleware } from './middleware/language-middleware.js';
import { csrfTokenMiddleware, doubleCsrfProtection, handleCsrfErrors } from './middleware/csrf-middleware.js';
import passport from './utility/passport.js';

export const startApp = async () => {
  const app = express();

  app.use(
    expressSession({
      secret: config.secretSession,
      saveUninitialized: true,
      resave: false,
      cookie: {
        maxAge: 86400000,
        secure: config.env === PRODUCTION,
        sameSite: "strict",
      },
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
  app.use(passport.initialize());
  app.use(passport.session());
  // app.use(csrfTokenMiddleware);
  // app.use(doubleCsrfProtection);
  // app.use(handleCsrfErrors);

  if (config.env === PRODUCTION)
    app.use(
      helmet({
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "cdn.jsdelivr.net"],
          styleSrc: ["'self'", "cdn.jsdelivr.net"],
        },
      }),
    );
  Sentry.setupExpressErrorHandler(app);
  app.use(rateLimiterMiddleware);
  app.use("/admin", isAuthMiddleware);
  // Routing
  app.use("/api", routerApi);
  if (config.env === DEVELOPMENT) app.use("/dev", routerDev);
  app.use(handle(i18next));
  app.use(languageMiddleware);
  app.use(routerWeb);
  // app.use(handleCsrfErrors);
  app.use(function onError(_err: any, _req: any, res: any, _next: any) {
    res.statusCode = 500;
    res.end(`${res.sentry}\n`);
  });

  return app;
};
