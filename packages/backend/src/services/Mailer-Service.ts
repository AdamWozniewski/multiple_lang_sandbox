import { mailer } from '../utility/mailing.js';
import type { IMailerService } from '@interface/mail-service.js';

export class MailerService implements IMailerService {
  async sendActivationEmail(email: string, link: string): Promise<void> {
    await mailer(email, "Activation Account", link);
  };

  async sendResetPasswordEmail(email: string, link: string): Promise<void> {
    await mailer(email, "Reset Password", link);
  };
}