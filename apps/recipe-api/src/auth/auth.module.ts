import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { JwtStrategy } from "./auth/jwt.strategy";
import { RefreshJwtStrategy } from "./auth/rjwt.strategy";
import { User } from "./user/user.entity";
import { UserService } from "./user/user.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET_TOKEN"),
        signOptions: {
          expiresIn: configService.get<number>("JWT_EXPIRATION_SECRET"),
        },
      }),
    }),
  ],
  providers: [AuthService, UserService, RefreshJwtStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, UserService],
})
export class AuthModule {}
