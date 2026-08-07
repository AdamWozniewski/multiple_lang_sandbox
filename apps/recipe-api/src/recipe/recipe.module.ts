import { Module } from '@nestjs/common';
import { CompaniesController } from './companies/companies.controller';
import { ProductsController } from './products/products.controller';
import { ProductsService } from './products/products.service';
import { CompaniesService } from './companies/companies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './products/product.entity';
import { Company } from './companies/company.entity';
import { IngredientsController } from './ingredients/ingredients.controller';
import { IngredientsService } from './ingredients/ingredients.service';
import { IngredientEntity } from './ingredients/ingredient.entity';
import { IngredientsRepository } from './ingredients/ingredientsRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Products, Company, IngredientEntity, IngredientsRepository])
  ],
  controllers: [CompaniesController, ProductsController, IngredientsController],
  providers: [CompaniesService, ProductsService, IngredientsService],
})
export class RecipeModule {
}
