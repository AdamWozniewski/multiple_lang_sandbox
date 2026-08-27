// import { userTable } from "@sql/models/index.js";
// import { db } from "@sql/db.js";
// import { userTable } from "@sql/models/index.js";
// import { db } from "@sql/db.js";
import type {ObjectId} from 'mongoose';
import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import { config } from "@config";
import type { IUserService } from "@interface/user-interface";
import type { IUser } from "@mongo/models/user.js";
import { User } from "@mongo/models/user.js";
import { hashPassword, verifyPassword } from "@utility/hash.js";
import { BaseService } from "./Base-Service.js";

const localUrl: string = `${config.appUrl}${config.port}`;

export class UserService extends BaseService implements IUserService {
  async createUser({ email, password, roles }: Partial<IUser>): Promise<IUser> {
    const user = new User({ email, password, roles });
    await user.save();
    return user;
  }

  async generateActivationToken(id: string): Promise<string> {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");

    const plain = randomBytes(32).toString("hex");
    user.apiToken = await hashPassword(plain);
    user.apiTokenExpires = new Date(Date.now() + 24 * 3600_000);
    await user.save();

    return plain;
  }

  async generateMagicLinkToken(id: string): Promise<{ [key: string]: any }> {
    const user: IUser | null = await User.findById(id);
    if (!user) throw new Error("User not found");
    const plain: string = randomBytes(32).toString("hex");
    const token: string = await hashPassword(plain);
    return {
      token,
      expiresAt: new Date(Date.now() + 24 * 3600_000),
      magicLink: `${localUrl}/verification/magic-link/verification?&magicLink=${token}`,
    };
  }

  async findUserById(id: string): Promise<IUser | null> {
    return User.findById(id).exec();
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).populate("roles").exec();
  }

  async updateUserProfile(
    id: string,
    data: Partial<IUser>,
    newAvatar?: string,
    newBgc?: string
  ): Promise<IUser | null> {
    const user = await User.findOne({id});

    if (newAvatar && user!.avatar) await fs.unlink(`public/img/uploads/${user!.avatar}`);
    if (newBgc && user!.bgc) await fs.unlink(`public/img/uploads/${user!.bgc}`);
    const result = await User.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true },
    );
    if (!result) throw new Error("User not found");

    return result;
  }

  async activateUser(id: string, token: string): Promise<IUser> {
    const user = (await this.findUserById(id)) as InstanceType<typeof User>;
    if (
      !user?.apiTokenExpires ||
      user.apiTokenExpires < new Date() ||
      !(await verifyPassword(token, user.apiToken))
    ) {
      throw new Error("Invalid user");
    }

    user.activate = true;
    user.apiToken = "";
    user.apiTokenExpires = null;
    await user.save();

    return user;
  }
}
