import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshJwtStrategy } from './auth/rjwt.strategy';
import { JwtStrategy } from './auth/jwt.strategy';
import { JWT_EXPIRATION_SECRET, JWT_SECRET_TOKEN } from '../utility/statics';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(JWT_SECRET_TOKEN),
        signOptions: {
          expiresIn: configService.get<number>(JWT_EXPIRATION_SECRET),
        },
      }),
    }),
  ],
  providers: [AuthService, UserService, RefreshJwtStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, UserService],
})
export class AuthModule {}
