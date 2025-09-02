// import "./newrelic";
import "./instrument";
import http from "node:http";
import path from "node:path";
import * as Sentry from "@sentry/node";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import { handle } from "i18next-http-middleware";
// import { runDBAdmin } from "./db/sql/init.ts";
import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import expressSession from "express-session";
import { readFile } from "node:fs/promises";
import { serve, setup } from "swagger-ui-express";
import { config } from '@config';
import { isAuthMiddleware } from "./middleware/is-auth-middleware";
import { rateLimiterMiddleware } from "./middleware/rate-limiter-middleware";
import { userMiddleware } from "./middleware/user-middleware";
import { globalMiddleware } from "./middleware/view-variables";
// import { routerApi } from "./routes/api/api.js";
import "./db/mongo/database.ts";
import { routerWeb } from "./routes/web/web";
import { routerDev } from "./routes/dev/dev";
import { __dirname } from '@utility/dirname';
import { DEVELOPMENT, PRODUCTION } from '@static/env';
import i18next from "./i18n";
import { languageMiddleware } from "./middleware/language-middleware";
// import { csrfTokenMiddleware, doubleCsrfProtection, handleCsrfErrors } from './middleware/csrf-middleware.js';
import passport from "./utility/passport";
// import { createServer as createViteServer, ViteDevServer } from "vite";
import { setupGraphQL } from "./routes/graphql/graphql";
import { sentryMiddleware } from "./middleware/sentry-middleware";
// import { minify } from 'html-minifier-terser';
// import { assetPathHelper } from './assetHelper';
// import htmlTransformMiddleware from './middleware/vite-middleware';

export const startApp = async () => {
  const app = express();
  const httpServer = http.createServer(app);
  // let vite: ViteDevServer | undefined;

  app.use(express.json());
  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors());

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
  // if (config.env === DEVELOPMENT) {
  //   vite = await createViteServer({ server: { middlewareMode: 'html' } });
  //   app.use(vite.middlewares);
  // } else {
  app.use(express.static("./public"));
  // }

  // app.use(htmlTransformMiddleware(vite));
  // const transformMw = htmlTransformMiddleware(vite);
  // app.use(transformMw);

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
  // app.use("/api", routerApi);
  if (config.env === DEVELOPMENT) app.use("/dev", routerDev);
  // app.use(handle(i18next));
  app.use(
    handle(i18next, {
      ignoreRoutes: ["/graphql"],
    }),
  );
  app.use(languageMiddleware);
  app.use(routerWeb);
  await setupGraphQL(app, httpServer);

  Sentry.setupExpressErrorHandler(app);
  app.use(sentryMiddleware);

  return httpServer;
};
