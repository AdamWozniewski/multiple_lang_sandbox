import type { Model, Types } from "mongoose";
import { model, Schema } from "mongoose";
import type { Role } from "@customTypes/roles.js";

export interface IUserRole extends Document {
  _id: Types.ObjectId;
  role: Role[];
}

const roleSchema = new Schema<IUserRole>({
  role: {
    type: [String],
    enum: ["user", "semi-admin", "admin"],
    default: ["user"],
  },
});

export const UserRole: Model<IUserRole> = model<IUserRole>(
  "UserRole",
  roleSchema,
);
