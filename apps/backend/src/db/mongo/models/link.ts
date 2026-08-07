import type { LinksType } from "@customTypes/links";
import type { IUser } from "@mongo/models/user";
import { type Model, model, type ObjectId, Schema, Types } from "mongoose";

export interface ILink extends Document {
  type: LinksType;
  maxUsage?: number;
  link: string;
  token?: string;
  active?: boolean;
  expiresAt?: Date;
  user?: ObjectId | IUser;
}

const linkSchema = new Schema<ILink>({
  type: {
    type: String,
    required: true,
  },
  maxUsage: {
    type: Number,
    required: false,
    default: 1,
  },
  link: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: false,
  },
  active: {
    type: Boolean,
    required: false,
    default: true,
  },
  expiresAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

linkSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

export const Link: Model<ILink> = model<ILink>("Link", linkSchema);
