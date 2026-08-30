import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Company } from './company.entity';
import { ProductsService } from '../products/products.service';
import { InjectRepository } from '@nestjs/typeorm';
import {Like, Repository, UpdateResult} from 'typeorm';
import {CreateCompaniesDto} from "./dto/create-companies.dto";
import {UpdateCompaniesDto} from "./dto/update-companies.dto";
import {UserService} from "../../auth/user/user.service";
import slugify from "slugify";
import {FilterQueryDto} from "../../commons/dto/FilterQueryDto";

@Injectable()
export class CompaniesService {
  // constructor(private productService: ProductsService) {
  //   this.productService = productService;
  // }
  constructor(@InjectRepository(Company) private companyRepository: Repository<Company>, private readonly userService: UserService) {
    
  }


  async getOneById(userId: number, id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: {
        id,
        isPublic: true,
        user: {
          id: userId
        }
      }, relations: {
        user: true,
        ingredients: true
      }
    });
    if (!company) {
      throw new HttpException(`Nie ma takiej Company`, 404);
    }
    return company;
  }

  async getOneOf(userId: number, id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: {
        id,
        user: {
          id: userId
        }
      }, relations: {
        user: true,
        ingredients: {
          product: true
        }
      }
    });
    if (!company) {
      throw new HttpException(`Nie ma takiej Company`, 404);
    }
    return company;
  }

  async create(userId: number, company: CreateCompaniesDto): Promise<Company> {
    const user = await this.userService.getOneById(userId);
    const slug = await this.generateSlug(company.name)
    return await this.companyRepository.save({
      ...company,
        slug,
        user: user!
    })
  }

  async read(userId:number, filters: FilterQueryDto<Company>): Promise<{ result: Company[]; total: number}> {
    const [result, total] =  await this.companyRepository.findAndCount({
      take: filters.limit,
      skip: filters.offset,
      order: {
        [filters.orderBy || 'id']: filters.order
      },
      relations: {
        ingredients: {
          product: true
        }
      },
      where: [
        {
          name: Like(`%${filters.query}%`),
          isPublic: true
        },
        {
          name: Like(`%${filters.query}%`),
          user: {
            id: userId
          }
        }
      ]
    });
    return  {
      result, total
    }
  }

  async update(userId: number, company: UpdateCompaniesDto): Promise<UpdateResult> {
    await this.getOneById(userId, company.id);
    return this.companyRepository.update(company.id, company);
  }

  async remove(userId: number, companyId: number): Promise<Company> {
    const company = await this.getOneById(userId , companyId);
    return this.companyRepository.remove(company);
  }

  async generateSlug(name:string) {
    let slug = slugify(name, {
      replacement: '-',
      lower: true
    });
    const exists = await this.findSlugs(slug);
    if (!exists || slug.length === 0 ) {
      return slug
    }
    slug = slug + '-' + exists.length
    return slug
  }

  private async findSlugs(slug:string): Promise<Company[]> {
    return await this.companyRepository
        .createQueryBuilder('company')
        .where('slug LIKE :slug', {slug: `${slug}%`})
        .getMany()
  }
}
