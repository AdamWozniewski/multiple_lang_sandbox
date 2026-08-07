import { mailer } from "@utility/mailing";
import type { Request, Response } from "express";

export class DevController {
  test__emailPage(_req: Request, res: Response) {
    res.render("pages/mailing/__test-email-page");
  }

  async test__sendEmail(req: Request, res: Response) {
    const { email, text } = req.body;
    await mailer(email, "Test", text, "");
    res.render("pages/subscribe-thanks");
  }
}
