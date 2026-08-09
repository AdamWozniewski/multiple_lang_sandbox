import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    register: jest.Mock;
    login: jest.Mock;
    setAuthToken: jest.Mock;
    tokenIsActive: jest.Mock;
    logout: jest.Mock;
  };

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
      setAuthToken: jest.fn().mockResolvedValue({
        accessToken: 'access.jwt.token',
        refreshToken: 'refresh.jwt.token',
      }),
      tokenIsActive: jest.fn().mockResolvedValue(true),
      logout: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: JwtService, useValue: {} },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('refresh', () => {
    it('reads the refresh token from req.cookies (plural) and validates it against the user hash', async () => {
      const req = {
        cookies: { refresh_token: 'raw-refresh-token' },
        user: { id: 1, refreshToken: 'stored-hash' },
      };
      const res = {};

      await controller.refresh(req, res as never);

      expect(authService.tokenIsActive).toHaveBeenCalledWith(
        'raw-refresh-token',
        'stored-hash',
      );
      expect(authService.setAuthToken).toHaveBeenCalledWith(res, {
        user_id: 1,
      });
    });

    it('does not read req.cookie (singular), which is always undefined', async () => {
      const req = {
        cookie: { refresh_token: 'should-not-be-used' },
        cookies: { refresh_token: 'raw-refresh-token' },
        user: { id: 1, refreshToken: 'stored-hash' },
      };
      const res = {};

      await controller.refresh(req, res as never);

      expect(authService.tokenIsActive).toHaveBeenCalledWith(
        'raw-refresh-token',
        'stored-hash',
      );
    });
  });

  describe('logout', () => {
    it('logs out the authenticated user', async () => {
      const req = { user: { id: 7 } };
      const res = {};

      await controller.logout(req, res as never);

      expect(authService.logout).toHaveBeenCalledWith(res, 7);
    });
  });
});
