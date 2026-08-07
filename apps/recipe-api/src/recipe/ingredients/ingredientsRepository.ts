import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { type DataSource, Repository } from "typeorm";

import { IngredientEntity } from "./ingredient.entity";

@Injectable()
export class IngredientsRepository extends Repository<IngredientEntity> {
  constructor(private dataSource: DataSource) {
    super(IngredientEntity, dataSource.createEntityManager());
  }

  async findById(id: number): Promise<IngredientEntity | null> {
    return this.createQueryBuilder("ingredients")
      .innerJoinAndSelect("ingredients.company", "company")
      .innerJoinAndSelect("ingredients.product", "product")
      .where("ingredients.id = :id", { id })
      .getOne();
  }
}
