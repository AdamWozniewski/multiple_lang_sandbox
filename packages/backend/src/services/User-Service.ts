import { hashPassword } from "@utility/hash.js";
// import { userTable } from "@sql/models/index.js";
// import { db } from "@sql/db.js";
import { User } from "@mongo/models/user.js";
import type { IUser } from "@mongo/models/user.js";
import { BaseService } from "./Base-Service.js";
import type { IUserService } from "../interfaces/user-interface.js";
import type { IRoleService } from "@interface/role-interface.js";
import type { IMailerService } from "./Mailer-Service.js";

export class UserService extends BaseService implements IUserService {
  private roleService: IRoleService;
  private mailerService: IMailerService;

  constructor(roleService: IRoleService, mailerService: IMailerService) {
    super();
    this.roleService = roleService;
    this.mailerService = mailerService;
  }

  async createUser({ email, password }: Partial<IUser>): Promise<IUser> {
    const passwordHash = await hashPassword(password as string);
    const userRoleId = await this.roleService.getDefaultUserRole();
    const user = new User({ email, password: passwordHash, roles: userRoleId });
    const savedUser = await user.save();

    const activationLink = `${process.env.APP_URL}/activate/${savedUser.id}/${savedUser.apiToken}`;
    await this.mailerService.sendActivationEmail(
      email as string,
      activationLink,
    );
    return user;
    // return db.insert(userTable).values({ email, password: passwordHash });
  }

  async createOAuthUser(email: string): Promise<IUser> {
    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      return existingUser;
    }

    const userRoleId = await this.roleService.getDefaultUserRole();
    const user = new User({
      email,
      password: null,
      roles: userRoleId,
      activate: true,
    });
    return await user.save();
  }

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
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    console.log(user);
    console.log(data);
    console.log(Object.assign(user, data));
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
