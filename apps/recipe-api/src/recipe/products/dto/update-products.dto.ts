import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductsDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  unit: 'kg' | 'g' | 'tsp' | 'sp' | 'pinch' | 'ml' | 'l' | 'item';

  @IsNumber()
  amount: number;

  @IsNumber()
  dishId: number;
}