import {MiddlewareConsumer, Module, NestModule, RequestMethod} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import {APP_FILTER, APP_GUARD, APP_INTERCEPTOR} from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { databaseConfig } from "./config/database.config";
import { envValidationConfig } from "./config/envValidation.config";
import { RecipeModule } from "./recipe/recipe.module";
import {LoggerMiddleware} from "./common/middlewares/logger/logger.middleware";
import {AppGuard} from "./common/guards/app/app.guard";
import {HttpFilter} from "./common/filters/http.filter";
import {WrapperInterceptor} from "./common/interceptors/wrapper/wrapper.interceptor";

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
    {
      provide: APP_GUARD,
      useClass: AppGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: WrapperInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(LoggerMiddleware)
        .forRoutes({path: 'company', method: RequestMethod.GET}) // ('*') for every path
  }
}
