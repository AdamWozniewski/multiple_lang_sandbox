import {
  Body, ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put, Req, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import {CreateCompaniesDto} from "./dto/create-companies.dto";
import {UpdateCompaniesDto} from "./dto/update-companies.dto";
import {JwtAuthGuard} from "../../auth/auth/jwt.guard";
import {AuthGuard} from "@nestjs/passport";
import {Company} from "./company.entity";
import {FilterQueryDto} from "../../commons/dto/FilterQueryDto";
import {FilterBy} from "../../commons/decorators/filter-by.decorator";

@Controller('companies')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'))
export class CompaniesController {
  constructor(private companyService: CompaniesService) {
    this.companyService = companyService;
  }

  @Get()
  findAll(@Req() req, @FilterBy<Company>() filters: FilterQueryDto<Company>) {
    return this.companyService.read(req.user.id, filters);
  }

  @Get(':companyId')
  findOne(@Req() req, @Param('companyId') companyId: number) {
    return this.companyService.getOneById(req.user.id, companyId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createCompany(@Req() req, @Body() company: CreateCompaniesDto) {
    await this.companyService.create(req.user.id, company);
  }

  @Put()
  async updateOne(@Req() req, @Body() company: UpdateCompaniesDto) {
    await this.companyService.update(req.user.id, company);
  }

  @Delete(':companyId')
  async deleteCompany(@Req() req, @Param('companyId') companyId: number) {
    await this.companyService.remove(req.user.id, companyId);
  }
}
