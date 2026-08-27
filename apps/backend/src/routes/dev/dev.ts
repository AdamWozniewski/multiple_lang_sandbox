import { Router } from "express";
import type { NextFunction, Request, Response } from "express";
import { DevController } from "../../controllers/dev/dev-controller";
import { PageController } from "../../controllers/web/page-controller.js";

const routerDev = Router();
const _page = new PageController();
const dev = new DevController();
routerDev.get("/health", (_req, res) => res.json({ ok: true }));
routerDev.get("/db-connect-status", (_req, res) => res.json({ ok: true }));
routerDev.get("/test-mailing", dev.test__emailPage);
routerDev.post("/test-mailing", dev.test__sendEmail);
routerDev.use(
  "/bull-mq",
  (_req: Request, res: Response, next: NextFunction) => {
    const setHeader = res.setHeader.bind(res);
    res.setHeader = ((name: string, value: any) =>
      name.toLowerCase() === "transfer-encoding"
        ? res
        : setHeader(name, value)) as typeof res.setHeader;
    next();
  },
  dev.bullMqConfig,
);
routerDev.get("/debug-sentry", (_req, _res) => {
  throw new Error("My first Sentry error!");
});

export { routerDev };