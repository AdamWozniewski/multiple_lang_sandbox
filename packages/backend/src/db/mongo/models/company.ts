import { model, type Model, type ObjectId, Schema, Types } from "mongoose";
import { validateForbiddenString } from "../validators";
import type { IUser } from "./user";

export interface ICompany extends Document {
  slug: string;
  name: string;
  employeesCount: number;
  user: Types.ObjectId | IUser;
  image?: string;
}

const companySchema = new Schema<ICompany>({
  slug: {
    type: String,
    unique: true,
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
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  image: String,
});
export const Company: Model<ICompany> = model<ICompany>(
  "Company",
  companySchema,
);
