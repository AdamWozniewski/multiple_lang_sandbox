import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompaniesController } from "./companies/companies.controller";
import { CompaniesService } from "./companies/companies.service";
import { Company } from "./companies/company.entity";
import { IngredientEntity } from "./ingredients/ingredient.entity";
import { IngredientsController } from "./ingredients/ingredients.controller";
import { IngredientsService } from "./ingredients/ingredients.service";
import { IngredientsRepository } from "./ingredients/ingredientsRepository";
import { Products } from "./products/product.entity";
import { ProductsController } from "./products/products.controller";
import { ProductsService } from "./products/products.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Products,
      Company,
      IngredientEntity,
      IngredientsRepository,
    ]),
  ],
  controllers: [CompaniesController, ProductsController, IngredientsController],
  providers: [CompaniesService, ProductsService, IngredientsService],
})
export class RecipeModule {}
