import type { IRoleService } from "@interface/role-interface.js";
import { UserRole } from "@mongo/models/roles.js";
import type { Types } from "mongoose";

export class RoleService implements IRoleService {
  async getDefaultUserRole(): Promise<Types.ObjectId> {
    const role = await UserRole.findOneAndUpdate(
      { role: ["user"] },
      { $setOnInsert: { role: ["user"] } },
      { upsert: true, new: true },
    );
    return role._id;
  }
}
