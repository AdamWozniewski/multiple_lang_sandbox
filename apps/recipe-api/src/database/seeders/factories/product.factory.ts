import { faker } from "@faker-js/faker";
import type { Products } from "../../../recipe/products/product.entity";

const units = ["kg", "g", "tsp", "sp", "pinch", "ml", "l", "item"] as const;

export function createRandomProduct(): Partial<Products> {
  return {
    name: faker.food.ingredient(),
    unit: faker.helpers.arrayElement(units),
  };
}
