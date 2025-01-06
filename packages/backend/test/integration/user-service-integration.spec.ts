import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { User } from '@mongo/models/user.js';
import { UserService } from '../../src/services/User-Service.js';
import { RoleService } from '../../src/services/Role-Services.js';
import { setupDatabase, tearDownDatabase } from '../config/config.js';


describe('UserService Integration with MongoDB', () => {
  let userService: UserService;
  let roleService: RoleService;

  beforeAll(async () => {
    await setupDatabase();
    roleService = new RoleService();
    userService = new UserService(roleService);
  });

  afterAll(async () => {
    await tearDownDatabase();
  });

  it('should create a user with default role', async () => {
    const email = 'integration@test.com';
    const password = 'integrationPassword';

    const user = await userService.createUser({ email, password });

    expect(user).toBeTruthy();
    expect(user.email).toBe(email);

    const userFromDb = await User.findOne({ email });
    expect(userFromDb).toBeTruthy();
    expect(userFromDb?.email).toBe(email);
    expect(userFromDb?.roles).toBeTruthy();
  });
});