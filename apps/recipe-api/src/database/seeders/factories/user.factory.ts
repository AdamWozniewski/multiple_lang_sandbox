import { faker } from '@faker-js/faker';
import { User } from '../../../auth/user/user.entity';

export function createRandomUser(): Partial<User> {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}