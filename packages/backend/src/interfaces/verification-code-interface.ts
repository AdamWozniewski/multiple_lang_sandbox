import type { IUser } from '@mongo/models/user.js';
import type { IEmailCode } from '@mongo/models/email-code.js';

export interface IVerificationCodeInterface {
  createVerificationCode(user: Partial<IUser>, code: string): Promise<IEmailCode>;
  getVerificationCode(user: Partial<IUser>, code: string): Promise<IEmailCode | null>;
  updateVerificationCode(user: Partial<IUser>, code: string): void;
}