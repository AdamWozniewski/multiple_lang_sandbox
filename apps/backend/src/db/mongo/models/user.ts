import type { TwoFactorAuthenticationType } from "@customTypes/two-factor-authentication-type.js";
import type { IBaseModel } from "@mongo/models/base-model.js";
import { BaseModel } from "@mongo/models/base-model.js";
import type { IUserRole } from "@mongo/models/roles.js";
import { hashPassword, verifyPassword } from "@utility/hash.js";
import { type ObjectId, Schema, type Types } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { validateEmail } from "../validators.js";

export interface IUser extends IBaseModel {
  _id: Types.ObjectId;
  id: string;
  email: string;
  password: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  apiToken?: string;
  apiTokenExpires: Date | null;
  activate: boolean;
  roles: ObjectId | IUserRole;
  twoFactorAuthentication?: boolean;
  twoFactorAuthenticationType?: TwoFactorAuthenticationType;

  // credentials?: Types.DocumentArray<IWebAuthnCredential>;

  comparePassword(password: string): boolean;

  fullName?: string;
}

const userSchema = new Schema<IUser>(
  {
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
      type: Schema.Types.ObjectId,
      required: true,
      ref: "UserRole",
      unique: false,
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
      enum: [
        "qr-code",
        "verification-code",
        "magic-link",
        "physical-key",
        "biometrics",
        "",
      ],
      default: "",
      required: false,
    },
    // credentials: {
    //   type: [WebAuthnCredentialSchema],
    //   required: false,
    //   default: undefined,
    // },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.pre("save", async function (next) {
  console.log(this);
  if (!this.id) this.id = this._id.toString();
  if (this.isNew && !this.activate)
    this.apiToken = await hashPassword(this.id.toString());
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
};

userSchema
  .virtual("fullName")
  .get(function () {
    return `${this.firstName || ""} ${this.lastName || ""}`;
  })
  .set(function (fullname: string) {
    const [firstName, ...rest] = fullname.split(" ");
    this.firstName = firstName;
    this.lastName = rest.join(" ");
  });

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

userSchema.plugin(uniqueValidator, {
  message: "Taki {PATH} ({VALUE}) już istnieje",
});

export class UserModel extends BaseModel<IUser> {
  constructor() {
    super("User", userSchema);
  }
}

export const User = new UserModel().getModel();
