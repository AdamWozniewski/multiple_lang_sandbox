import { IsNumber, IsOptional, IsString } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';
import { UpdateCompaniesDto } from './update-companies.dto';

export class CreateCompaniesDto extends OmitType(UpdateCompaniesDto, ['id'] as const) {

  @IsString()
  name: string;

  @IsNumber()
  servings: number;

  @IsOptional()
  @IsString()
  description?: string;
}