import { faker } from "@faker-js/faker";
import type { DataSource } from "typeorm";
import { User } from "../../../auth/user/user.entity";
import { Company } from "../../../recipe/companies/company.entity";
import { IngredientEntity } from "../../../recipe/ingredients/ingredient.entity";
import { Products } from "../../../recipe/products/product.entity";
import { createRandomCompany } from "../factories/company.factory";
import { createRandomIngredient } from "../factories/ingredient.factory";
import { createRandomProduct } from "../factories/product.factory";
import { createRandomUser } from "../factories/user.factory";

export async function seed(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const productRepo = dataSource.getRepository(Products);
  const companyRepo = dataSource.getRepository(Company);
  const ingredientRepo = dataSource.getRepository(IngredientEntity);

  const users = await userRepo.save(
    Array.from({ length: 5 }, () => userRepo.create(createRandomUser())),
  );
  console.log(`Seeded ${users.length} users`);

  const products = await productRepo.save(
    Array.from({ length: 20 }, () => productRepo.create(createRandomProduct())),
  );
  console.log(`Seeded ${products.length} products`);

  const companies = await companyRepo.save(
    Array.from({ length: 10 }, () =>
      companyRepo.create({
        ...createRandomCompany(),
        user: faker.helpers.arrayElement(users),
      }),
    ),
  );
  console.log(`Seeded ${companies.length} companies`);

  const ingredients = await ingredientRepo.save(
    companies.flatMap((company) => {
      const count = faker.number.int({ min: 3, max: 8 });
      const shuffled = faker.helpers.shuffle(products).slice(0, count);

      return shuffled.map((product) =>
        ingredientRepo.create({
          ...createRandomIngredient(),
          company,
          product,
        }),
      );
    }),
  );
  console.log(`Seeded ${ingredients.length} ingredients`);
}
