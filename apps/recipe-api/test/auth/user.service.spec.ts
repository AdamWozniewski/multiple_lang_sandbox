import { Test, type TestingModule } from "@nestjs/testing";
import { UserService } from "../../src/auth/user/user.service";
import {getRepositoryToken} from "@nestjs/typeorm";
import {User} from "../../src/auth/user/user.entity";

describe("UserService", () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, {provide: getRepositoryToken(User), useValue: {}}],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
