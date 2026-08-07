import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt'
) {

  constructor(
    private readonly authService: AuthService,
    configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookies?.['access_token']
        }
      ]),

      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_TOKEN')!
    })
  }

  async validate(payload: { user_id }) {
    const user = this.authService.validateUser(payload.user_id);
    if(!user) {
      throw new UnauthorizedException();
    }
    return user
  }
}