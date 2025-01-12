import { mailer } from '../utility/mailing.js';

export interface IMailerService {
  sendActivationEmail(email: string, activationLink: string): Promise<void>;
}

export class MailerService implements IMailerService {
  async sendActivationEmail(email: string, activationLink: string): Promise<void> {
    await mailer(email, "Activation", activationLink);
  }
}