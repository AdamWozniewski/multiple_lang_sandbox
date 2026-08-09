import path from "node:path";
import { ConfigModule, ConfigService } from "@nestjs/config";
import type {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from "@nestjs/typeorm";
import {
  POSTGRES_DB_DATABASE,
  POSTGRES_DB_HOST,
  POSTGRES_DB_PASSWORD,
  POSTGRES_DB_PORT,
  POSTGRES_DB_USERNAME,
} from '../utility/statics';

export class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: configService.get<string>(POSTGRES_DB_HOST, 'localhost'),
      port: configService.get<number>(POSTGRES_DB_PORT, 5432),
      username: configService.get<string>(POSTGRES_DB_USERNAME),
      password: configService.get<string>(POSTGRES_DB_PASSWORD),
      database: configService.get<string>(POSTGRES_DB_DATABASE),
      autoLoadEntities: true,
      synchronize: false,
      migrationsRun: false,
    };
  }
}

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) =>
    TypeOrmConfig.getOrmConfig(configService),
  inject: [ConfigService],
};
