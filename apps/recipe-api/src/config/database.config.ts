import path from "node:path";
import { ConfigModule, ConfigService } from "@nestjs/config";
import type {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from "@nestjs/typeorm";
import * as dotenv from "dotenv";

const env = process.env.NODE_ENV || "development";
const dotenv_path = path.resolve(process.cwd(), `.env.${env}`);
const result = dotenv.config({ path: dotenv_path });

if (result.error) {
}

export class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    return {
      type: "better-sqlite3", // configService.get<string>.('DB_HOST')
      database: "./database/my-db.sqlite3",
      autoLoadEntities: true,
      synchronize: false, // NIE DO PROD

      migrationsRun: false,
      entities: ["dist/**/*.entity{.ts,.js}"],
      migrations: ["deist/migrations/**/*{.ts,.js}"],
    };
  }
}

export default TypeOrmConfig.getOrmConfig(new ConfigService());

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) =>
    TypeOrmConfig.getOrmConfig(configService),
  inject: [ConfigService],
};
