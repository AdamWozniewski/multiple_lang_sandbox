import { mailer } from '../utility/mailing.js';

export interface IMailerService {
  sendActivationEmail(email: string, link: string): Promise<void>;
  sendResetPasswordEmail(email: string, link: string): Promise<void>;
}

export class MailerService implements IMailerService {
  async sendActivationEmail(email: string, link: string): Promise<void> {
    await mailer(email, "Activation", link);
  }

  async sendResetPasswordEmail(email: string, link: string): Promise<void> {
    await mailer(email, "Reset Password", link);
  }
}