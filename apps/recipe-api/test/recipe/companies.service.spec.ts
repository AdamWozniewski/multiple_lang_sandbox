import { Test, type TestingModule } from "@nestjs/testing";
import {CompaniesService} from "../../src/recipe/companies/companies.service";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Company} from "../../src/recipe/companies/company.entity";
import {UserService} from "../../src/auth/user/user.service";
import {expect, Mock, vi} from "vitest";
import {Like, type Repository, SelectQueryBuilder} from "typeorm";

describe("CompaniesService", () => {
  let service: CompaniesService;
  let repository: Repository<Company>

  const mockGetMany = vi.fn();

  const mockQueryBuilder = {
    where: vi.fn(),
    getMany: mockGetMany,
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockQueryBuilder.where.mockReturnValue(mockQueryBuilder);
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompaniesService,
        {provide: getRepositoryToken(Company), useValue: {
          createQueryBuilder: vi.fn(() => mockQueryBuilder)
          }},
        {provide: UserService, useValue: {}}
      ],
    }).compile();

    repository = module.get(getRepositoryToken(Company))
    service = module.get<CompaniesService>(CompaniesService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it('should generate slug when companies[] is 0', async () => {
    mockGetMany.mockReturnValue([])
    const toSlug = 'test with test';
    const result = await service.generateSlug(toSlug);
    expect(result).toBe('test-with-test')
  });

  it('should generate slug when companies[] is more than 0', async () => {
    mockGetMany.mockReturnValue([new Company()])
    const toSlug = 'test with test';
    const result = await service.generateSlug(toSlug);
    expect(result).toBe('test-with-test-1')
  })
});
