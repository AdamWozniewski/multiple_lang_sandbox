import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { databaseConfig } from "./config/database.config";
import { envValidationConfig } from "./config/envValidation.config";
import { RecipeModule } from "./recipe/recipe.module";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: "short",
        ttl: 1000,
        limit: 3,
      },
      {
        name: "medium",
        ttl: 10000,
        limit: 20,
      },
      {
        name: "long",
        ttl: 60000,
        limit: 100,
      },
    ]),
    RecipeModule,
    ConfigModule.forRoot({
      // ignoreEnvFile: true,
      isGlobal: true,
      validationSchema: envValidationConfig,
      envFilePath: [`../../.env`], // .${process.env.NODE_ENV}
    }),
    TypeOrmModule.forRootAsync(databaseConfig),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
