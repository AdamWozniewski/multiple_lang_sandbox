import { Products } from '../products/product.entity';
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IngredientEntity } from '../ingredients/ingredient.entity';
import {User} from "../../auth/user/user.entity";

@Entity()
export class Company extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'varchar',
  })
  slug?: string;

  @Column({
    type: 'decimal',
  })
  servings: number;


  @Column({
    nullable: true,
    type: 'text',
  })
  description?: string;


  @ManyToOne(() => User, (user: User) => user.companies, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({
    type: 'boolean', default: false,
  })
  isPublic: boolean;


  @OneToMany(
    () => IngredientEntity, (ingredients: IngredientEntity) => ingredients.company, {
      onDelete: 'CASCADE'
    }
  )
  ingredients: IngredientEntity[]
}

