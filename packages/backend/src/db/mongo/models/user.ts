import { type Model, Schema, Types, model, type ObjectId } from 'mongoose';
import { hashPassword, verifyPassword } from "@utility/hash.js";
import { validateEmail } from "../validators.js";
import type { IUserRole } from '@mongo/models/roles.js';

export interface IUser extends Document {
  _id: Types.ObjectId;
  id: string;
  email: string;
  password: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  apiToken?: string;
  activate: boolean;
  roles: ObjectId | IUserRole;

  comparePassword(password: string): boolean;
  compareToken(token: string): boolean;

  fullName?: string;
}

const userSchema = new Schema<IUser>({
  id: {
    type: String,
    required: false,
  },
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
  roles: {
    type: Types.ObjectId,
    required: true,
    ref: "UserRole",
  },
  activate: {
    type: Boolean,
    default: false
  },
});

userSchema.pre("save", async function(next) {
  if (!this.activate) {
    this.apiToken = await hashPassword(this._id.toString());
  }
  if (!this.id) {
    this.id = this._id;
  }
  this.password = await hashPassword(this.password);

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

userSchema.methods = {
  comparePassword: function (password: string) {
    return verifyPassword(password, this.password);
  },
  compareToken: function (token: string) {
    return verifyPassword(token, this.apiToken);
  }
};

userSchema.virtual("fullName").get(function () {
  return `${this.firstName || ""} ${this.lastName || ""}`;
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});
export const User: Model<IUser> = model<IUser>("User", userSchema);
