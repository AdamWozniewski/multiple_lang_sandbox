import { hashPassword } from '../utility/hash.js';
import bcrypt from 'bcrypt';

export class PasswordService {
  hash(password: string): string {
    return hashPassword(password);
  }
  verifyPassword = (
    password: string,
    hashedPassword: string,
  ) => bcrypt.compareSync(password, hashedPassword)
}