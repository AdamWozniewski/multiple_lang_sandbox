import { Test, type TestingModule } from "@nestjs/testing";
import {IngredientsController} from "../../src/recipe/ingredients/ingredients.controller";
import {IngredientsService} from "../../src/recipe/ingredients/ingredients.service";

describe("IngredientsController", () => {
  let controller: IngredientsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngredientsController],
      providers: [{ provide: IngredientsService, useValue: {} }]
    }).compile();

    controller = module.get<IngredientsController>(IngredientsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
