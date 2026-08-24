import type { IMailerService } from "@interface/mail-service.js";
import {mailerQueue} from "../events/mailer-queue";

export class MailerService implements IMailerService {
  private standardMailerConfig = { attempts: 3, backoff: { type: "exponential", delay: 2000 } }
  async sendActivationEmail(email: string, link: string): Promise<void> {
    // await mailer(email, "Activation Account", link);
    await mailerQueue.add(
        "email_activation",
        {email, subject: "Activation Account", content: link},
        this.standardMailerConfig
    )
  }

  async sendResetPasswordEmail(email: string, link: string): Promise<void> {
    await mailerQueue.add(
        "email_reset_password",
        {email, subject: "Reset Account password", content: link},
        this.standardMailerConfig
    );
  }

  async send2FAVerificationCode(email: string, link: string): Promise<void> {
    await mailerQueue.add(
        "email_verification_code",
        {email, subject: "Verification Code", content: link, template: "verification-code"},
        this.standardMailerConfig
    );
  }

  async sendMagicLinkEmail(email: string, link: string): Promise<void> {
    await mailerQueue.add(
        "email_magic_link",
        {email, subject: "Magic Link", content: link, template: "magic-link-mail"},
        this.standardMailerConfig
    );
  }
}
