import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async findOne(condition: Partial<UpdateUserDto>) {
    return this.userRepository.findOne({
      where: {
        ...condition,
      },
    });
  }
  async create(user: Pick<CreateUserDto, 'email' | 'password'>): Promise<User> {
    const entity = this.userRepository.create({
      email: user.email.trim().toLocaleLowerCase(),
      password: this.hashPassword(user.password),
    });
    return this.userRepository.save(entity);
  }

  async update(id: number, props: Partial<UpdateUserDto>) {
    const user = await this.userRepository.preload({
      id,
      ...props,
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.userRepository.save(user);
  }

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 8);
  }
}
