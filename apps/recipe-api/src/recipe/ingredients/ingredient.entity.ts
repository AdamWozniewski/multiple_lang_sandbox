import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Company } from "../companies/company.entity";
import { Products } from "../products/product.entity";

@Entity()
export class IngredientEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "decimal",
  })
  amount: number;

  @ManyToOne(
    () => Products,
    (product: Products) => product.ingredients,
  )
  product: Products;

  @Column({
    type: "boolean",
    default: false,
  })
  archived: boolean;

  @ManyToOne(
    () => Company,
    (company: Company) => company.ingredients,
      { onDelete: 'SET NULL', nullable: true }
  )
  company: Company;
}
