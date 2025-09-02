import { type Model, Schema, model, type ObjectId, Types } from "mongoose";
import type { IUser } from "@mongo/models/user";
import type { LinksType } from "@customTypes/links";

export interface ILink extends Document {
  type: LinksType;
  maxUsage?: number;
  url: string;
  active: boolean;
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
  url: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  user: {
    type: Types.ObjectId,
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
