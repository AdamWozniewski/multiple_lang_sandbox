import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
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
      ignoreEnvFile: true,
      isGlobal: true,
      validationSchema: envValidationConfig,
      // envFilePath: [`.env.${process.env.NODE_ENV}`],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
