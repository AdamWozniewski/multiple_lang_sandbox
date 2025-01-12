import { type Model, Schema, model, } from 'mongoose';

export interface ILog extends Document {
  type: string;
  maxUsage: number;
  url: string;
}
// userControllerLogger.error("Login failed", { metadata: { ip: req.ip, message: error.message, email: req.body.email } });
const linkSchema = new Schema<ILog>({
  type: {
    type: String,
    required: true,
  },
  maxUsage: {
    type: Number,
    required: false,
  },
  url: {
    type: String,
    required: true,
  }
});

linkSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

export const Link: Model<ILog> = model<ILog>("Link", linkSchema);
