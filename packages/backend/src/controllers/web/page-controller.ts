import type { Request, Response } from "express";
import { mailer } from "@utility/mailing.js";
import { status500 } from "@static/status-500.js";
// import { logger } from '@utility/logger.js';

// const pageControllerLogger = logger("PageController");

export class PageController {
  async home(req: Request, res: Response) {
    try {
      res.render("pages/home", {
        companies: [],
        title: "req.t('title')",
        url: req.url,
      });
    } catch (_e) {
      res.render("pages/status_error", {
        statusType: status500,
      });
    }
  }

  notFound(_req: Request, res: Response) {
    res.render("pages/status_error", {
      title: "asfasfaf",
      subtitle: "asfafaf",
      layout: "layouts/minimalistic",
    });
  }

  test__emailPage(_req: Request, res: Response) {
    res.render("pages/mailing/__test-email-page");
  }

  async test__sendEmail(req: Request, res: Response) {
    const { email, text } = req.body;
    await mailer(email, "Test", text);
    res.render("pages/subscribe-thanks");
  }
}
