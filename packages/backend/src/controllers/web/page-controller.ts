import { Request, Response } from 'express';
import { userTable } from '@sql/models/index.js';
import { db } from "@sql/db.js";
import { mailer } from "../../services/mailing.js";
import { logger } from "../../services/logger.js";
import { status500 } from "../../static/status-500.js";

export class PageController {
  async home(req: Request, res: Response) {
    try {
      // const users = await db.select().from(userTable);
      // logger.info('User accessed dashboard', {  });
      res.render('pages/home', { companies: [], title: 'Strona główna', url: req.url });
    } catch (e) {
      res.render('pages/status_error', status500);
    }

  }

  notFound(req: Request, res: Response) {
    res.render('pages/status_error', { title: 'asfasfaf', subtitle: 'asfafaf', layout: 'layouts/minimalistic' });
  }

  test__emailPage(req: Request, res: Response) {
    res.render(`pages/mailing/__test-email-page`);
  }
  async test__sendEmail(req: Request, res: Response) {
    const {email} = req.body;
    await mailer(email, 'Test', 'tester');
    res.render('pages/subscribe-thanks');
  }
}