import mongoose, { type Model, Schema } from "mongoose";
import { generate } from "randomstring";
import { hashPassword, verifyPassword } from "../../../services/hash.js";
import { validateEmail } from "../validators.js";

export interface IUser extends Document {
  email: string;
  password: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  apiToken?: string;

  comparePassword(password: string): boolean;

  fullName?: string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, "Pole email jest wymagane"],
    validate: [validateEmail, "Niepoprawny adres email"],
    trim: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [4, "hasło powinno posiadać przynajmniej 4 znaki"],
  },
  avatar: String,
  firstName: String,
  lastName: String,
  apiToken: String,
});

userSchema.pre("save", function (next) {
  this.password = hashPassword(this.password);
  next();
});

userSchema.post("save", (err: any, _doc: any, next: any) => {
  if (err.code === 11000) {
    err.errors = {
      email: {
        message: "Taki email już istnieje",
      },
    };
  }
  next(err);
});

userSchema.post("save", function (_err: any, _doc: any, next: any) {
  if (this.isNew) {
    this.apiToken = generate(30);
  }
  next();
});

userSchema.methods = {
  comparePassword: function (password: string) {
    return verifyPassword(password, this.password);
  },
};

userSchema.virtual("fullName").get(function () {
  return `${this.firstName || ""} ${this.lastName || ""}`;
});

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
