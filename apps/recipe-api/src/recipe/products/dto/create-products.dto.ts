import { OmitType } from "@nestjs/mapped-types";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { UpdateProductsDto } from "./update-products.dto";

export class CreateProductsDto extends OmitType(UpdateProductsDto, [
  "id",
] as const) {
  @IsString()
  name: string;

  @IsString()
  unit: "kg" | "g" | "tsp" | "sp" | "pinch" | "ml" | "l" | "item";

  @IsNumber()
  amount: number;

  @IsNumber()
  dishId: number;
}
