import { Exclude } from "class-transformer";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Company } from "../../recipe/companies/company.entity";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    unique: true,
  })
  email: string;

  @Exclude()
  @Column({
    type: "varchar",
  })
  password: string;

  @OneToMany(
    () => Company,
    (company: Company) => company.user,
  )
  companies: Company[];

  @Column({
    type: "varchar",
    default: null,
  })
  refreshToken: string;
}
