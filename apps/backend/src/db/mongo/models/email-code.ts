import { type Model, model, Schema, type Types } from 'mongoose';

export interface IEmailCode extends Document {
  _id: Types.ObjectId;
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
