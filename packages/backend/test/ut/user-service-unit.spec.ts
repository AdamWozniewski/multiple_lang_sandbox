import { describe, it, expect, vi, beforeEach } from 'vitest';
import { User } from '@mongo/models/user.js';
import { UserService } from '../../src/services/User-Service.js';

const mockRoleService = {
  getDefaultUserRole: vi.fn(),
};

vi.mock('@mongo/models/user.js', () => ({
  User: {
    create: vi.fn(),
    findOne: vi.fn(),
  },
}));

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(mockRoleService as any);
    vi.clearAllMocks();
  });

  it('should create a user with a hashed password and default role', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const mockRoleId = 'mockRoleId';

    mockRoleService.getDefaultUserRole.mockResolvedValue(mockRoleId);
    vi.spyOn(User.prototype, 'save').mockResolvedValue({
      email,
      roles: mockRoleId,
      id: 'mockUserId',
    });

    const user = await userService.createUser({ email, password });

    expect(mockRoleService.getDefaultUserRole).toHaveBeenCalled();
    expect(user.email).toBe(email);
    expect(user.roles).toBe(mockRoleId);
  });
});