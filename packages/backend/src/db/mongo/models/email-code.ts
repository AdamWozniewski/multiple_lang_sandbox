import { model, type Model, Schema } from "mongoose";
import { IUser } from "@mongo/models/user.js";

export interface IEmailCode extends Document {
  email: string;
  code: string;
  expiresAt: Date;
  used: boolean;
}

const emailCodeSchema = new Schema<IEmailCode>({
  email: String,
  code: String,
  expiresAt: {
    type: Date,
    expires: 0,
  },
  used: {
    type: Boolean,
    default: false,
  },
});

export const EmailCode: Model<IEmailCode> = model<IEmailCode>(
  "EmailCode",
  emailCodeSchema,
);
