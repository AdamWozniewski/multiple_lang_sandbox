import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe, Patch,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "../../auth/auth/jwt.guard";
import { FilterBy } from "../../common/decorators/filter-by.decorator";
import type { FilterQueryDto } from "../../common/dto/FilterQueryDto";
import { CompaniesService } from "./companies.service";
import type { Company } from "./company.entity";
import type { CreateCompaniesDto } from "./dto/create-companies.dto";
import type { UpdateCompaniesDto } from "./dto/update-companies.dto";

@Controller("companies")
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard("jwt"))
export class CompaniesController {
  constructor(private companyService: CompaniesService) {
    this.companyService = companyService;
  }

  @Get()
  findAll(@Req() req, @FilterBy<Company>() filters: FilterQueryDto<Company>) {
    return this.companyService.read(req.user.id, filters);
  }

  @Get(":companyId")
  findOne(@Req() req, @Param("companyId") companyId: number) {
    return this.companyService.getOneById(req.user.id, companyId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createCompany(@Req() req, @Body() company: CreateCompaniesDto) {
    await this.companyService.create(req.user.id, company);
  }

  @Patch(':companyId')
  async updateOne(@Req() req, @Param('companyId', ParseIntPipe) companyId, @Body() company: UpdateCompaniesDto) {
    return await this.companyService.update(req.user.id, companyId, company);
  }

  @Delete(":companyId")
  async deleteCompany(@Req() req, @Param("companyId") companyId: number) {
    await this.companyService.remove(req.user.id, companyId);
  }
}
