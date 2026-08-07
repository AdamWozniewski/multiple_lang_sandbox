import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/user.entity';
import { LoginUserDto } from '../user/dto/login-user.dto';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService, private readonly configService: ConfigService
    ) {
  }


  async register(user: Pick<CreateUserDto, 'email' | 'password' >): Promise<User> {
    return this.userService.create(user)
  }

  async login({email, password}: LoginUserDto): Promise<User> {
    const user = await this.userService.findOne({email});
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new BadRequestException('Wrong password');
    }
    return user
  }

  generateTokens(payload): [token: string, refreshToken: string] {
    const token = this.jwtService.sign(payload)
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<number>('JWT_EXPIRATION_REFRESH_SECRET'),
      secret: `${this.configService.get<string>('JWT_REFRESH_SECRET_TOKEN')}`,
    })
    console.log(token)
    return [token, refreshToken]
  }

  async setAuthToken(res, payload): Promise<{accessToken: string, refreshToken: string}> {
    const [accessToken, refreshToken] = this.generateTokens(payload)
    await this.userService.update(payload.user_id, {
      refreshToken: bcrypt.hashSync(refreshToken, 8)
    })
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      domain: this.configService.get('DOMAIN'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_SECRET') as string,
    })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        domain: this.configService.get('DOMAIN'),
        expiresIn: this.configService.get<string>('JWT_EXPIRATION_REFRESH_SECRET') as string,
      })
    return {accessToken, refreshToken}
  }

  async validateUser(payload): Promise<User | null> {
    return await this.userService.findOne({
      id: payload.user_id
    })
  }

  async tokenIsActive(token: string, hash: string): Promise<boolean> {
    const tokenIsActive = await bcrypt.compare(token, hash || '')
    if(!tokenIsActive) {
      throw new ForbiddenException();
    }
    return true;
  }

  async logout(res, user_id) {
    await this.userService.update(user_id, {
      refreshToken: undefined
    })
    res.clearCookie('access_token', {
      domain: this.configService.get('DOMAIN'),
      httpOnly: true
    }).clearCookie('refresh_token', {
      domain: this.configService.get('DOMAIN'),
      httpOnly: true
    })
  }
}
