import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Products } from '../products/product.entity';
import {Company} from "../companies/company.entity";

@Entity()
export class IngredientEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'decimal',
  })
  amount: number;

  @ManyToOne(
    () => Products, (product: Products) => product.ingredients
  )
  product: Products

  @ManyToOne(
    () => Company, (company: Company) => company.ingredients
  )
  company: Company
}