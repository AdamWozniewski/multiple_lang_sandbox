import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Company } from './company.entity';
import { ProductsService } from '../products/products.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import {CreateCompaniesDto} from "./dto/create-companies.dto";
import {UpdateCompaniesDto} from "./dto/update-companies.dto";
import {UserService} from "../../auth/user/user.service";
import slugify from "slugify";

@Injectable()
export class CompaniesService {
  // constructor(private productService: ProductsService) {
  //   this.productService = productService;
  // }
  constructor(@InjectRepository(Company) private companyRepository: Repository<Company>, private readonly userService: UserService) {
    
  }


  async getOneById(id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: {
        id
      }, relations: {
        // products: true
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
        // products: true
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

  read(): Promise<Company[]> {
    return Company.find({
      relations: {
        // products: true,
      },
    });

  }

  async update(company: UpdateCompaniesDto): Promise<UpdateResult> {
    await this.getOneById(company.id);
    return this.companyRepository.update(company.id, company);
  }

  async remove(companyId: number): Promise<Company> {
    const company = await this.getOneById(companyId);
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
