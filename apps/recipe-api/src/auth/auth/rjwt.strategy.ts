import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { JWT_REFRESH_SECRET, REFRESH_TOKEN } from "@utility/statics";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  "refresh-jwt",
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
      secretOrKey: configService.get<string>(JWT_REFRESH_SECRET)!,
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
