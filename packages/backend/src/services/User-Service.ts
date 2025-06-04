// import { userTable } from "@sql/models/index.js";
// import { db } from "@sql/db.js";
import { User } from "@mongo/models/user.js";
import type { IUser } from "@mongo/models/user.js";
import { BaseService } from "./Base-Service.js";
import type { IUserService } from "../interfaces/user-interface.js";
import type { IRoleService } from "@interface/role-interface.js";

export class UserService extends BaseService implements IUserService {
  private roleService: IRoleService;

  constructor(roleService: IRoleService) {
    super();
    this.roleService = roleService;
  }

  async createUser({ email, password, roles }: Partial<IUser>): Promise<IUser> {
    const user = new User({ email, password, roles });
    await user.save();
    return user;
  }

  // async createOAuthUser(email: string): Promise<IUser> {
  //   const existingUser = await this.findUserByEmail(email);
  //   if (existingUser) {
  //     return existingUser;
  //   }
  //
  //   const userRoleId = await this.roleService.getDefaultUserRole();
  //   const user = new User({
  //     email,
  //     password: null,
  //     roles: userRoleId,
  //     activate: true,
  //   });
  //   return await user.save();
  // }

  async findUserById(id: string): Promise<IUser | null> {
    return User.findById(id).exec();
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).populate("roles");
  }

  async updateUserProfile(
    id: string,
    data: Partial<IUser>,
  ): Promise<IUser | null> {
    console.log(data);
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    Object.assign(user, data);
    await user.save();
    return user;
  }

  async activateUser(id: string, token: string): Promise<IUser> {
    const user = (await this.findUserById(id)) as InstanceType<typeof User>;
    if (!user || !user.compareToken(token)) {
      throw new Error("Invalid user");
    }

    user.activate = true;
    user.apiToken = "";
    await user.save();

    return user;
  }
}
