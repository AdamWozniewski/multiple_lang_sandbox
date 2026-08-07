import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository, UpdateResult } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { Company } from './company.entity';
import type { CreateCompaniesDto } from './dto/create-companies.dto';
import type { UpdateCompaniesDto } from './dto/update-companies.dto';

@Injectable()
export class CompaniesService {
  // constructor(private productService: ProductsService) {
  //   this.productService = productService;
  // }
  constructor(@InjectRepository(Company) private companyRepository: Repository<Company>) {
    
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

  create(company: CreateCompaniesDto): Promise<Company> {
    // const newCompany: Company = new Company();
    // Object.assign(newCompany, company);

    return this.companyRepository.save(company);
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
}
