import type { IUser } from '@mongo/models/user.js';

export interface IUserService {
  createUser({ email, password }: Partial<IUser>): Promise<IUser>;
  findUserById(id: string): Promise<IUser | null>;
  findUserByEmail(email: string): Promise<IUser | null>;
  updateUserProfile(id: string, data: Partial<IUser>): Promise<IUser | null>;
}