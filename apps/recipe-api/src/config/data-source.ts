import { DataSource } from "typeorm";
import { User } from "../auth/user/user.entity";
import { Company } from "../recipe/companies/company.entity";
import { IngredientEntity } from "../recipe/ingredients/ingredient.entity";
import { Products } from "../recipe/products/product.entity";

export default new DataSource({
  type: "better-sqlite3",
  database: "./database/my-db.sqlite3",
  // entities: ['dist/**/*.entity.js'],
  entities: [Products, IngredientEntity, Company, User],
  migrations: ["dist/migrations/**/*.js"],
  // synchronize: true
});
