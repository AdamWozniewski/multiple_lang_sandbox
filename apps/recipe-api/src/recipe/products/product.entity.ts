import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Company } from "../companies/company.entity";
import { IngredientEntity } from "../ingredients/ingredient.entity";

@Entity()
export class Products extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
  })
  name: string;

  @Column({
    type: "varchar",
  })
  unit: "kg" | "g" | "tsp" | "sp" | "pinch" | "ml" | "l" | "item";

  @OneToMany(
    () => IngredientEntity,
    (ingredients: IngredientEntity) => ingredients.product,
    {
      onDelete: "CASCADE",
    },
  )
  ingredients: IngredientEntity[];
}
