import {IsNumber} from "class-validator";

export class CreateIngredientsDto {
    @IsNumber()
    company: number;

    @IsNumber()
    product: number;

    @IsNumber()
    amount: number;
}