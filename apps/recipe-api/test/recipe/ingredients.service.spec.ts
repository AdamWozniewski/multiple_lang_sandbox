import { Test, type TestingModule } from "@nestjs/testing";
import { IngredientsService } from "../../src/recipe/ingredients/ingredients.service";
import {IngredientsRepository} from "../../src/recipe/ingredients/ingredientsRepository";
import {CompaniesService} from "../../src/recipe/companies/companies.service";
import {ProductsService} from "../../src/recipe/products/products.service";

describe("IngredientsService", () => {
  let service: IngredientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          IngredientsService,
        {provide: IngredientsRepository, useValue: {}},
        {provide: CompaniesService, useValue: {}},
        {provide: ProductsService, useValue: {}}
      ],
    }).compile();

    service = module.get<IngredientsService>(IngredientsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
