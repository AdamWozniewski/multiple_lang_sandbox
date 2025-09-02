import { type Model, Schema, model } from "mongoose";

export interface ILog extends Document {
  timestamp: string;
  level: string;
  controller: string;
  event: string;
  ip: string;
  message: string;
  email?: string;
}

const logSchema = new Schema<ILog>({
  timestamp: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  controller: {
    type: String,
    required: true,
  },
  event: {
    type: String,
    required: true,
  },
  ip: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
});

logSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

logSchema.index({ timestamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 14 });

export const Log: Model<ILog> = model<ILog>("Log", logSchema);
