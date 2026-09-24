import { Test, type TestingModule } from "@nestjs/testing";
import {CompaniesController} from "../../src/recipe/companies/companies.controller";
import {CompaniesService} from "../../src/recipe/companies/companies.service";

describe("CompaniesController", () => {
  let controller: CompaniesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [{provide: CompaniesService, useValue: {}}]
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
