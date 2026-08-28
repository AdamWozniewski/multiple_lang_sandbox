import { Module } from '@nestjs/common';
import {Products} from "./products/product.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProductsController} from "./products/products.controller";
import {ProductsService} from "./products/products.service";
import {Company} from "./companies/company.entity";
import {IngredientEntity} from "./ingredients/ingredient.entity";
import {IngredientsRepository} from "./ingredients/ingredientsRepository";
import {IngredientsController} from "./ingredients/ingredients.controller";
import {IngredientsService} from "./ingredients/ingredients.service";
import {CompaniesService} from "./companies/companies.service";
import {CompaniesController} from "./companies/companies.controller";
import {AuthModule} from "../auth/auth.module";


@Module({
  imports: [
    TypeOrmModule.forFeature([Products, Company, IngredientEntity]),
    AuthModule,
  ],
  controllers: [CompaniesController, ProductsController, IngredientsController],
  providers: [CompaniesService, ProductsService, IngredientsService, IngredientsRepository],
})
export class RecipeModule {
}
