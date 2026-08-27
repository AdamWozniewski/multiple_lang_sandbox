import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { RefreshAuthGuard } from './refresh.guard';
import { JwtAuthGuard } from './jwt.guard';
import {REFRESH_TOKEN} from "@utility/statics";

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(
    @Body() { email, password }: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const user = await this.authService.register({ email, password });
    await this.authService.setAuthToken(res, { user_id: user.id });
    return user;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() { email, password }: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const user = await this.authService.login({ email, password });
    await this.authService.setAuthToken(res, { user_id: user.id });
    return user;
  }

  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req, @Res({ passthrough: true }) res: Response) {
    await this.authService.tokenIsActive(
      req?.cookies?.[REFRESH_TOKEN],
      req.user.refreshToken,
    );
    await this.authService.setAuthToken(res, {
      user_id: req.user.id,
    });
    return {
      message: 'token refreshed',
    };
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(res, req.user.id);

    return {
      message: 'Logged Out',
    };
  }
}
