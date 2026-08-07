import { Module } from "@nestjs/common";
// import { UserModule } from './auth/user/user.module';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { databaseConfig } from "./config/database.config";
import { envValidationConfig } from "./config/envValidation.config";
import { RecipeModule } from "./recipe/recipe.module";

@Module({
  imports: [
    RecipeModule,
    TypeOrmModule.forRootAsync(databaseConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      validationSchema: envValidationConfig,
    }),
    // UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
