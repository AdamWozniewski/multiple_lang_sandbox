import mongoose, { type Model, type ObjectId, Schema } from "mongoose";
import { validateForbiddenString } from "../validators.js";
import type { IUser } from "./user.js";

export interface ICompany extends Document {
  slug: string;
  name: string;
  employeesCount: number;
  user: ObjectId | IUser;
  image?: string;
}

const companySchema = new Schema<ICompany>({
  slug: {
    type: String,
    required: [true, "pole slug jest wymagane"],
    minlength: 3,
    maxlength: [6, "maksymalna liczba znaków to 6"],
    validate: (value: string) => validateForbiddenString(value, "slug"),
  },
  name: {
    type: String,
    required: true,
  },
  employeesCount: {
    type: Number,
    min: 1,
  },
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  image: String,
});
export const Company: Model<ICompany> = mongoose.model<ICompany>(
  "Company",
  companySchema,
);
