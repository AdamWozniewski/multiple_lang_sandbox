import type { Types } from 'mongoose';

export interface IRoleService {
  getDefaultUserRole(): Promise<Types.ObjectId>;
}