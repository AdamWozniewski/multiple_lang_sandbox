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
  Put, Req, UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import {CreateCompaniesDto} from "./dto/create-companies.dto";
import {UpdateCompaniesDto} from "./dto/update-companies.dto";
import {JwtStrategy} from "../../auth/auth/jwt.strategy";
import {JwtAuthGuard} from "../../auth/auth/jwt.guard";

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
  @UseGuards(JwtAuthGuard)
  async createCompany(@Req() req, @Body() company: CreateCompaniesDto) {
    await this.companyService.create(req.user.id, company);
  }

  @Put()
  async updateOne(@Body() company: UpdateCompaniesDto) {
    await this.companyService.update(company);
  }

  @Delete(':companyId')
  async deleteCompany(@Param('companyId') companyId: number) {
    await this.companyService.remove(companyId);
  }
}
