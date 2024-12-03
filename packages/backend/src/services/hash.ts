import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = (password: string) => bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_ROUNDS));

export const verifyPassword = async (password: string, hashedPassword: string) => await bcrypt.compare(password, hashedPassword);