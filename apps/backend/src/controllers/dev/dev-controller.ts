import { mailer } from "@utility/mailing";
import type {NextFunction, Request, Response} from "express";
import {expressBullMQ} from "../../routes/events/bull-mq";

export class DevController {
  test__emailPage(_req: Request, res: Response) {
    res.render("pages/mailing/__test-email-page");
  }

  async test__sendEmail(req: Request, res: Response) {
    const { email, text } = req.body;
    await mailer(email, "Test", text, "");
    res.render("pages/subscribe-thanks");
  }

  bullMqConfig(req: Request, res: Response, next: NextFunction) {
    return expressBullMQ(req, res, next);
  }
}
