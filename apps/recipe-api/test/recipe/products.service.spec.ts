import { Test, type TestingModule } from "@nestjs/testing";
import { ProductsService } from "../../src/recipe/products/products.service";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Products} from "../../src/recipe/products/product.entity";
import {CompaniesService} from "../../src/recipe/companies/companies.service";

describe("ProductsService", () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, {provide: getRepositoryToken(Products), useValue: {}}, {provide: CompaniesService, useValue:{}}],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
