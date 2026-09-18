import {ForbiddenException, HttpException, Injectable, NotFoundException} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import slugify from "slugify";
import {Like, type Repository} from "typeorm";
import { UserService } from "../../auth/user/user.service";
import type { FilterQueryDto } from "../../common/dto/FilterQueryDto";
import { Company } from "./company.entity";
import type { CreateCompaniesDto } from "./dto/create-companies.dto";
import type { UpdateCompaniesDto } from "./dto/update-companies.dto";

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    private readonly userService: UserService,
  ) {}

  async getOneById(userId: number, id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: {
        id,
        isPublic: true,
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
        ingredients: true,
      },
    });
    if (!company) throw new HttpException(`Nie ma takiej Company`, 404);
    return company;
  }

  async getOneOf(userId: number, id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: {
        id,
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
        ingredients: {
          product: true,
        },
      },
    });
    if (!company) throw new HttpException(`Nie ma takiej Company`, 404);
    return company;
  }

  async create(userId: number, company: CreateCompaniesDto): Promise<Company> {
    const user = await this.userService.getOneById(userId);
    const slug = await this.generateSlug(company.name);
    return await this.companyRepository.save({
      ...company,
      slug,
      user: user!,
    });
  }

  async read(
    userId: number,
    filters: FilterQueryDto<Company>,
  ): Promise<{ result: Company[]; total: number }> {
    const [result, total] = await this.companyRepository.findAndCount({
      take: filters.limit,
      skip: filters.offset,
      order: {
        [filters.orderBy || "id"]: filters.order,
      },
      relations: {
        ingredients: {
          product: true,
        },
      },
      where: [
        {
          name: Like(`%${filters.query}%`),
          isPublic: true,
        },
        {
          name: Like(`%${filters.query}%`),
          user: {
            id: userId,
          },
        },
      ],
    });
    return {
      result,
      total,
    };
  }

  async update(
    userId: number,
    companyId: number,
    company: UpdateCompaniesDto,
  ): Promise<Company> {
    const { raw } = await this.companyRepository
      .createQueryBuilder()
      .update(Company)
      .set(company)
      .where("id = :id", { id: companyId })
      .andWhere('"userId" = :userId', { userId })
      .returning("*")
      .updateEntity(true)
      .execute();
    if (!raw[0]) throw new ForbiddenException("not allowed");
    return raw[0];
  }

  async remove(userId: number, companyId: number): Promise<{success: boolean}> {
    const company = await this.getOneById(userId, companyId);
    if(!company) throw new NotFoundException('Nie ma company do usunuiecia')
    if (company.user.id !== userId) throw new ForbiddenException('Nie możesz usunąć')
    const { affected } = await this.companyRepository.delete(companyId);
    return affected ? { success: true } : { success: false }
  }

  async generateSlug(name: string) {
    let slug = slugify(name, {
      replacement: "-",
      lower: true,
    });
    const exists = await this.findSlugs(slug);
    if (!exists || slug.length === 0) return slug;
    slug = slug + "-" + exists.length;
    return slug;
  }

  private async findSlugs(slug: string): Promise<Company[]> {
    return await this.companyRepository
      .createQueryBuilder("company")
      .where("slug LIKE :slug", { slug: `${slug}%` })
      .getMany();
  }
}
