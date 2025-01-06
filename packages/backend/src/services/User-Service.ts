import { hashPassword } from "./hash.js";
// import { userTable } from "@sql/models/index.js";
// import { db } from "@sql/db.js";
import { User } from "@mongo/models/user.js";
import type { IUser } from "@mongo/models/user.js";
import { BaseService } from "./Base-Service.js";
import type { IUserService } from "../interfaces/user-interface.js";
import { mailer } from './mailing.js';
import type { IRoleService } from '@interface/role-interface.js';

export class UserService extends BaseService implements IUserService {
  private roleService: IRoleService;

  constructor(roleService: IRoleService) {
    super();
    this.roleService = roleService;
  }

  async createUser({ email, password }: Partial<IUser>): Promise<IUser> {
    const passwordHash = hashPassword(password as string);
    const userRoleId = await this.roleService.getDefaultUserRole();
    const user = new User({ email, password: passwordHash, roles: userRoleId });
    const savedUser = await user.save();

    const activationLink = `${process.env.APP_URL}/activate/${savedUser.id}/${savedUser.apiToken}`;
    await mailer(email as string, "Activation", activationLink);
    return user
    // return db.insert(userTable).values({ email, password: passwordHash });
  }

  async findUserById(id: string): Promise<IUser | null> {
    return User.findById(id).exec();
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  async updateUserProfile(
    id: string,
    data: Partial<IUser>,
  ): Promise<IUser | null> {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");

    Object.assign(user, data);
    await user.save();
    return user;
  }

  async activateUser(id: string, token: string): Promise<IUser> {
    const user = await this.findUserById(id) as InstanceType<typeof User>;

    if (!user || !user.compareToken(token)) {
      throw new Error("Invalid user");
    }

    user.activate = true;
    user.apiToken = "";
    await user.save();

    return user;
  }
}
