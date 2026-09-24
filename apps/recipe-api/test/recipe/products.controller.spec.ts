import { Test, type TestingModule } from "@nestjs/testing";
import { ProductsController } from "../../src/recipe/products/products.controller";
import {ProductsService} from "../../src/recipe/products/products.service";

describe("ProductsController", () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: {} }], // pusty obiekt, który oszukuje ProductController
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
