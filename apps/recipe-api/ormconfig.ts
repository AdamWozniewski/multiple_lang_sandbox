import 'reflect-metadata';
import * as path from 'node:path';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST || 'localhost',
  port: Number(process.env.POSTGRES_DB_PORT) || 5432,
  username: process.env.POSTGRES_DB_USERNAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  database: process.env.POSTGRES_DB_DATABASE,
  entities: [path.join(__dirname, 'src/**/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, 'src/database/migrations/*.{ts,js}')],
  synchronize: false,
});
