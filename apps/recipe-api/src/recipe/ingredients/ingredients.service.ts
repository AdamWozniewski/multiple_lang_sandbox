import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IngredientEntity } from './ingredient.entity';
import { Repository } from 'typeorm';
import { IngredientsRepository } from './ingredientsRepository';
import {CompaniesService} from "../companies/companies.service";
import {CreateIngredientsDto} from "./dto/create-ingredients.dto";
import {ProductsService} from "../products/products.service";

@Injectable()
export class IngredientsService {
  constructor(
      private readonly ingredientRepository: IngredientsRepository,
      private readonly companyService: CompaniesService,
      private readonly productService: ProductsService
  ) {
  }

  async findOne(userId: number, id: number): Promise<IngredientEntity> {
    const ingredient = await this.ingredientRepository.findOne({
      relations: {
        company: {
          user: true
        },
        product: true,
      },
      where: {
        id
      }
    });
    if (!ingredient || ingredient.company.user.id !== userId && !ingredient.company.isPublic) {
      throw new NotFoundException('Nie ma')
    }
    return ingredient
  }

  async create(userId: number, ingredient: CreateIngredientsDto): Promise<IngredientEntity> {
    const company = await this.companyService.getOneOf(userId, ingredient.company);
    const product = await this.productService.getOneById(ingredient.product);
    return this.ingredientRepository.save({
      ...ingredient, company, product
    })
  }

}
