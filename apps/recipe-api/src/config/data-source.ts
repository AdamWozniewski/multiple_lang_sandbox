import { DataSource } from "typeorm";
import { User } from "../auth/user/user.entity";
import { Company } from "../recipe/companies/company.entity";
import { IngredientEntity } from "../recipe/ingredients/ingredient.entity";
import { Products } from "../recipe/products/product.entity";

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST || 'localhost',
  port: Number(process.env.POSTGRES_DB_PORT) || 5432,
  username: process.env.POSTGRES_DB_USERNAME,
  password: process.env.POSTGRES_DB_PASSWORD,
  database: process.env.POSTGRES_DB_DATABASE,
  entities: [Products, IngredientEntity, Company, User],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
});