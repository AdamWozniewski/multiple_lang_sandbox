import { Test, type TestingModule } from "@nestjs/testing";
import {CompaniesService} from "../../src/recipe/companies/companies.service";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Company} from "../../src/recipe/companies/company.entity";
import {UserService} from "../../src/auth/user/user.service";

describe("CompaniesService", () => {
  let service: CompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompaniesService,
        {provide: getRepositoryToken(Company), useValue: {}},
        {provide: UserService, useValue: {}}
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
