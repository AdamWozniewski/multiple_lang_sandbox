import {
  Body, ClassSerializerInterceptor,
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
import type { ConfigService } from '@nestjs/config';
import type { JwtService } from '@nestjs/jwt';
import type { CreateUserDto } from '../user/dto/create-user.dto';
import type { LoginUserDto } from '../user/dto/login-user.dto';
import type { User } from '../user/user.entity';
import type { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { RefreshAuthGuard } from './refresh.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService, private readonly configService: ConfigService) {}
  @Post('register')
  async register(@Body() {email, password}: CreateUserDto, @Res({passthrough: true}) res: Response): Promise<User> {
    const user = await this.authService.register({email, password});
    await this.authService.setAuthToken(res, {user_id: user.id});
    return user
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() {email, password}: LoginUserDto, @Res() res) {
    const user = await this.authService.login({email, password})
    await this.authService.setAuthToken(res, {user_id: user.id});
    return res.json({
      ...user,
      password: undefined
    })
  }
  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req, @Res() res) {
    await this.authService.tokenIsActive(
      req?.cookie?.['refresh_token'],
      req.user.refreshToken
    )
    await this.authService.setAuthToken(res, {
      user_id: req.user.id
    })
    res.json({
      message: 'token refreshed'
    })
  }


  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req, @Res() res) {
    await this.authService.logout(res, req.user.id);

    return res.json({
      message: 'Logged Out'
    })
  }
}
