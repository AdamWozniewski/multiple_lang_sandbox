import { BaseService } from "@services/Base-Service";
import type { IVerificationCodeInterface } from "@interface/verification-code-interface";
import { EmailCode } from "@mongo/models/email-code";
import type { IEmailCode } from "@mongo/models/email-code";
import type { IUser } from "@mongo/models/user";

export class VerificationCodeService
  extends BaseService
  implements IVerificationCodeInterface
{
  async createVerificationCode(
    user: Partial<IUser>,
    code: string,
  ): Promise<IEmailCode> {
    return await EmailCode.create({
      email: user.email,
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      used: false,
    });
  }

  async getVerificationCode(
    email: string,
    code: string,
  ): Promise<IEmailCode | null> {
    return EmailCode.findOne({
      email,
      code,
      used: false,
      expiresAt: { $gt: new Date() },
    });
  }

  async updateVerificationCode({
    email,
    code,
    used,
  }: Partial<IEmailCode>): Promise<void> {
    await EmailCode.updateOne({
      email,
      code,
      used,
    });
  }
}
