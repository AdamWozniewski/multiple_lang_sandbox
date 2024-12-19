import { Router } from "express";
import { PageController } from "../controllers/web/page-controller.js";

const routerDev = Router();
const page = new PageController();
routerDev.get("/test-mailing", page.test__emailPage);
routerDev.post("/test-mailing", page.test__sendEmail);
routerDev.get("/debug-sentry", function mainHandler(_req, _res) {
  throw new Error("My first Sentry error!");
});

export { routerDev };
