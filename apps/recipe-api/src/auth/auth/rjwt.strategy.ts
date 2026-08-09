import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import {JWT_REFRESH_SECRET_TOKEN, REFRESH_TOKEN} from '../../utility/statics';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookies?.[REFRESH_TOKEN];
        },
      ]),

      ignoreExpiration: false,
      secretOrKey: configService.get<string>(JWT_REFRESH_SECRET_TOKEN)!,
    });
  }

  async validate(payload: { user_id }) {
    const user = await this.authService.validateUser(payload.user_id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
