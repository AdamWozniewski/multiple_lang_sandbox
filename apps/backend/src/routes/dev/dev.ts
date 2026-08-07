import { Router } from "express";
import { DevController } from "../../controllers/dev/dev-controller";
import { PageController } from "../../controllers/web/page-controller.js";

const routerDev = Router();
const _page = new PageController();
const dev = new DevController();
routerDev.get("/health", (_req, res) => res.json({ ok: true }));
routerDev.get("/db-connect-status", (_req, res) => res.json({ ok: true }));
routerDev.get("/test-mailing", dev.test__emailPage);
routerDev.post("/test-mailing", dev.test__sendEmail);
routerDev.get("/debug-sentry", (_req, _res) => {
  throw new Error("My first Sentry error!");
});

export { routerDev };
