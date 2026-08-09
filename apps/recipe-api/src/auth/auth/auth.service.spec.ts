import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: { update: jest.Mock };
  let jwtService: { sign: jest.Mock };
  let configService: { get: jest.Mock };

  const configValues: Record<string, string> = {
    DOMAIN: 'localhost',
    JWT_EXPIRATION_SECRET: '3600',
    JWT_EXPIRATION_REFRESH_SECRET: '604800',
    JWT_REFRESH_SECRET_TOKEN: 'refresh-secret',
  };

  beforeEach(async () => {
    userService = { update: jest.fn().mockResolvedValue(undefined) };
    jwtService = { sign: jest.fn() };
    configService = { get: jest.fn((key: string) => configValues[key]) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setAuthToken', () => {
    it('sets access_token and refresh_token cookies with maxAge derived from the expiration config', async () => {
      jwtService.sign
        .mockReturnValueOnce('access.jwt.token')
        .mockReturnValueOnce('refresh.jwt.token');

      const res = { cookie: jest.fn().mockReturnThis() };

      const result = await service.setAuthToken(res, { user_id: 1 });

      expect(result).toEqual({
        accessToken: 'access.jwt.token',
        refreshToken: 'refresh.jwt.token',
      });

      expect(res.cookie).toHaveBeenCalledWith(
        'access_token',
        'access.jwt.token',
        expect.objectContaining({
          httpOnly: true,
          domain: 'localhost',
          maxAge: 3600 * 1000,
        }),
      );

      expect(res.cookie).toHaveBeenCalledWith(
        'refresh_token',
        'refresh.jwt.token',
        expect.objectContaining({
          httpOnly: true,
          domain: 'localhost',
          maxAge: 604800 * 1000,
        }),
      );

      // Never the old, broken values.
      expect(res.cookie).not.toHaveBeenCalledWith(
        'refreshToken',
        expect.anything(),
        expect.anything(),
      );
      const [, , accessOptions] = res.cookie.mock.calls[0];
      const [, , refreshOptions] = res.cookie.mock.calls[1];
      expect(accessOptions).not.toHaveProperty('expiresIn');
      expect(refreshOptions).not.toHaveProperty('expiresIn');
    });

    it('persists a bcrypt hash of the refresh token on the user', async () => {
      jwtService.sign
        .mockReturnValueOnce('access.jwt.token')
        .mockReturnValueOnce('refresh.jwt.token');
      const res = { cookie: jest.fn().mockReturnThis() };

      await service.setAuthToken(res, { user_id: 42 });

      expect(userService.update).toHaveBeenCalledWith(
        42,
        expect.objectContaining({ refreshToken: expect.any(String) }),
      );
      const [, { refreshToken: storedHash }] = userService.update.mock.calls[0];
      expect(storedHash).not.toBe('refresh.jwt.token');
    });
  });

  describe('tokenIsActive', () => {
    it('resolves true when the token matches the stored hash', async () => {
      const res = { cookie: jest.fn().mockReturnThis() };
      jwtService.sign
        .mockReturnValueOnce('access.jwt.token')
        .mockReturnValueOnce('refresh.jwt.token');
      await service.setAuthToken(res, { user_id: 1 });
      const [, { refreshToken: hash }] = userService.update.mock.calls[0];

      await expect(
        service.tokenIsActive('refresh.jwt.token', hash),
      ).resolves.toBe(true);
    });

    it('throws ForbiddenException when the token is undefined (mirrors the req.cookies bug)', async () => {
      await expect(
        service.tokenIsActive(undefined as unknown as string, 'some-hash'),
      ).rejects.toThrow();
    });
  });
});
