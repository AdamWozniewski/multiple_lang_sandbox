export interface IMailerService {
  sendActivationEmail(email: string, link: string): Promise<void>;
  sendResetPasswordEmail(email: string, link: string): Promise<void>;
}
