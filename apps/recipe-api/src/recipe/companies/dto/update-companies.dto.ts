import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCompaniesDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber(
    {},
    {
      message: "Servings must by a number",
    },
  )
  servings: number;

  @IsOptional()
  @IsString()
  description?: string;
}
