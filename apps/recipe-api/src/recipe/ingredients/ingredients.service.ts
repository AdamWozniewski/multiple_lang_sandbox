import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IngredientEntity } from './ingredient.entity';
import { Repository } from 'typeorm';
import { IngredientsRepository } from './ingredientsRepository';

@Injectable()
export class IngredientsService {
  constructor(private readonly ingredientRepository: IngredientsRepository) {
  }

  async findOne(id: number): Promise<IngredientEntity> {
    const ingredient = await this.ingredientRepository.findById(id);
    if (!ingredient) {
      throw new NotFoundException('Nie ma')
    }
    return ingredient
  }


}
