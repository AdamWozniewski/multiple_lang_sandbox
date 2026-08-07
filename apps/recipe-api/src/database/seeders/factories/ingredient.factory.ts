import { faker } from '@faker-js/faker';
import { IngredientEntity } from '../../../recipe/ingredients/ingredient.entity';

export function createRandomIngredient(): Partial<IngredientEntity> {
  return {
    amount: parseFloat(faker.number.float({ min: 0.5, max: 500, fractionDigits: 1 }).toFixed(1)),
  };
}