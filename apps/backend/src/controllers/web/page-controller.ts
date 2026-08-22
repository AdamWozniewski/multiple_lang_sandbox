import { status500 } from "@static/status-500";
import type { Request, Response } from "express";

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
      res.render("pages/status-error", {
        statusType: status500,
      });
    }
  }

  notFound(_req: Request, res: Response) {
    res.render("pages/status-error", {
      title: "NIE_ZNALEZIONO",
      subtitle: "nie znaleziono",
      layout: "layouts/minimalistic",
    });
  }
}
