import { type Model, Schema, Types, model, type ObjectId } from "mongoose";
import { randomBytes } from 'node:crypto';
import uniqueValidator from 'mongoose-unique-validator';
import { hashPassword, verifyPassword } from "@utility/hash.js";
import { validateEmail } from "../validators.js";
import type { IUserRole } from "@mongo/models/roles.js";
import type { TwoFactorAuthenticationType } from "@customTypes/two-factor-authentication-type.js";

export interface IUser extends Document {
  _id: Types.ObjectId;
  id: string;
  email: string;
  password: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  apiToken?: string;
  apiTokenExpires: Date;
  activate: boolean;
  roles: ObjectId | IUserRole;
  twoFactorAuthentication?: boolean;
  twoFactorAuthenticationType?: TwoFactorAuthenticationType;

  comparePassword(password: string): boolean;
  compareToken(token: string): Promise<boolean>;
  generateActivationToken(): Promise<string>;

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
    unique: true,
    trim: true,
    lowercase: true,
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
  apiTokenExpires: Date,
  roles: {
    type: Types.ObjectId,
    required: true,
    ref: "UserRole",
  },
  activate: {
    type: Boolean,
    default: false,
  },
  twoFactorAuthentication: {
    type: Boolean,
    default: false,
  },
  twoFactorAuthenticationType: {
    type: String,
    enum: ["qr", "ec", "ml", "pk", "bic", ''],
    default: '',
    required: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.id) this.id = this._id;
  if (this.isNew && !this.activate) this.apiToken = await hashPassword(this.id.toString());

  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hashPassword(this.password);
});

userSchema.methods = {
  comparePassword: async function (password: string) {
    return await verifyPassword(password, this.password);
  },
  compareToken: async function (token: string) {
    if (!this.apiTokenExpires || this.apiTokenExpires < new Date()) return false;
    return await verifyPassword(token, this.apiToken);
  },
  generateActivationToken: async function () {
    const plain = randomBytes(32).toString('hex');
    this.apiToken = await hashPassword(plain);
    this.apiTokenExpires = new Date(Date.now() + 24 * 3600_000);
    await this.save();
    return plain;
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

userSchema.plugin(uniqueValidator, {
  message: 'Taki {PATH} ({VALUE}) już istnieje'
});

export const User: Model<IUser> = model<IUser>("User", userSchema);
