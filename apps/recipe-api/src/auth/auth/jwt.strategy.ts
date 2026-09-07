import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ACCESS_TOKEN, JWT_SECRET } from "@utility/statics";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookies?.[ACCESS_TOKEN];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(JWT_SECRET)!,
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
