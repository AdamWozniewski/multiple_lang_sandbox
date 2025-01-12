import { describe, it, expect, vi, beforeEach } from 'vitest';
import { User } from '@mongo/models/user.js';
import { UserService } from '../../src/services/User-Service.js';
import type { IMailerService } from '../../src/services/Mailer-Service.js';
// import bcrypt from 'bcrypt';

// Mock bcrypt
// vi.mock('bcrypt', () => ({
//   hashSync: vi.fn().mockReturnValue('mockHashedPassword'),
//   genSaltSync: vi.fn().mockReturnValue('mockSalt'),
//   compareSync: vi.fn().mockReturnValue(true),
// }));

const mockRoleService = {
  getDefaultUserRole: vi.fn(),
};

vi.mock('@mongo/models/user.js', () => {
  const mockSave = vi.fn().mockResolvedValue({
    email: 'test@example.com',
    roles: 'mockRoleId',
    id: 'mockUserId',
    apiToken: 'mockApiToken',
  });

  return {
    User: vi.fn().mockImplementation(() => ({
      save: mockSave,
    })),
  };
});

const mockMailerService: IMailerService = {
  sendActivationEmail: vi.fn(),
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(mockRoleService as any, mockMailerService);
    vi.clearAllMocks();
  });

  it('should create a user with a hashed password and default role', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const mockRoleId = 'mockRoleId';
    const activationLink = `${process.env.APP_URL}/activate/mockUserId/mockApiToken`;

    mockRoleService.getDefaultUserRole.mockResolvedValue(mockRoleId);

    const user = await userService.createUser({ email, password });

    expect(mockRoleService.getDefaultUserRole).toHaveBeenCalled();
    expect(mockMailerService.sendActivationEmail).toHaveBeenCalledWith(email, activationLink);
    expect(user.email).toBe(email);
    expect(user.password).toBe('mockHashedPassword'); // Sprawdź zamockowane hasło
    expect(user.roles).toBe(mockRoleId);
  });
});
