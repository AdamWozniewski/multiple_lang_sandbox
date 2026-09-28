import { Test, type TestingModule } from "@nestjs/testing";
import { ProductsController } from "../../src/recipe/products/products.controller";
import {ProductsService} from "../../src/recipe/products/products.service";
import {expect, vi} from "vitest";
import {FilterQueryDto} from "../../src/common/dto/FilterQueryDto";
import {Products} from "../../src/recipe/products/product.entity";

describe("ProductsController", () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: {
          findAll() {}
        } }], // pusty obiekt, który oszukuje ProductController
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it('should give all products', async () => {
    const filter = new FilterQueryDto<Products>('', 1, 1, 'ASC', 'id');
    const product = new Products();
    Object.assign(product, {id: 1, name: 'sample product'})
    vi.spyOn(service, 'findAll').mockImplementation(async () => ({
      result: [product],
      total: 1
    }))
    const result = await controller.findAll(filter);
    expect(result).toEqual({
      result: [{id: 1, name: 'sample product'}],
      total: 1
    });
    expect(service.findAll).toHaveBeenCalled();
  });
});
