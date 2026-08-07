import { faker } from '@faker-js/faker';
import { Company } from '../../../recipe/companies/company.entity';

export function createRandomCompany(): Partial<Company> {
  return {
    name: faker.food.dish(),
    slug: faker.helpers.slugify(faker.food.dish()).toLowerCase(),
    servings: faker.number.int({ min: 1, max: 12 }),
    description: faker.food.description(),
    isPublic: faker.datatype.boolean(),
  };
}