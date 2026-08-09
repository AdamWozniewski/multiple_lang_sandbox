import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Images } from '../../gallery/images/images.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Exclude()
  @Column({
    type: 'varchar',
  })
  password: string;

  @Exclude()
  @Column({
    type: 'varchar',
    default: null,
  })
  refreshToken: string;

  @OneToMany(() => Images, (image: Images) => image.user)
  images: Images[];
}
