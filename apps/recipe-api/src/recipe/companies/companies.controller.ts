import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import type { Company } from './company.entity';
import { UpdateCompaniesDto } from './dto/update-companies.dto';
import { CreateCompaniesDto } from './dto/create-companies.dto';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private companyService: CompaniesService) {
    this.companyService = companyService;
  }

  @Get()
  findAll() {
    return this.companyService.read();
  }

  @Get(':companyId')
  findOne(@Param('companyId') companyId: number) {
    return this.companyService.getOneById(companyId);
  }

  @Post()
  createCompany(@Body() company: CreateCompaniesDto) {
    this.companyService.create(company);
  }

  @Put()
  updateOne(@Body() company: UpdateCompaniesDto) {
    this.companyService.update(company);
  }

  @Delete(':companyId')
  deleteCompany(@Param('companyId') companyId: number) {
    this.companyService.remove(companyId);
  }
}
