import { Injectable, NotFoundException } from "@nestjs/common";
import { CompaniesService } from "../companies/companies.service";
import { ProductsService } from "../products/products.service";
import type { CreateIngredientsDto } from "./dto/create-ingredients.dto";
import type { IngredientEntity } from "./ingredient.entity";
import { IngredientsRepository } from "./ingredientsRepository";

@Injectable()
export class IngredientsService {
  constructor(
    private readonly ingredientRepository: IngredientsRepository,
    private readonly companyService: CompaniesService,
    private readonly productService: ProductsService,
  ) {}

  async findOne(userId: number, id: number): Promise<IngredientEntity> {
    const ingredient = await this.ingredientRepository.findOne({
      relations: {
        company: {
          user: true,
        },
        product: true,
      },
      where: {
        id,
      },
    });
    if (
      !ingredient ||
      (ingredient.company.user.id !== userId && !ingredient.company.isPublic)
    ) {
      throw new NotFoundException("Nie ma");
    }
    return ingredient;
  }

  async create(
    userId: number,
    ingredient: CreateIngredientsDto,
  ): Promise<IngredientEntity> {
    const company = await this.companyService.getOneOf(
      userId,
      ingredient.company,
    );
    const product = await this.productService.getOneById(ingredient.product);
    return this.ingredientRepository.save({
      ...ingredient,
      company,
      product,
    });
  }
}
