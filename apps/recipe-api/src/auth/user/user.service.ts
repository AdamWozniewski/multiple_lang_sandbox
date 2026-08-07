import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import type { Repository } from 'typeorm';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
  }
  async findOne(condition) {
    return this.userRepository.findOne({where: {
    ...condition
      }});
  }
  async create(user: Pick<CreateUserDto, 'email' | 'password' >): Promise<User> {
    return this.userRepository.save({
      email: user.email.trim().toLocaleLowerCase(),
      password: this.hashPassword(user.password)
    });
  }

  async update(id, props: Partial<UpdateUserDto>) {
    const user = await this.userRepository.preload({
      id, ...props
    });
    if(!user) {
      throw new NotFoundException('user not found')
    }
    return this.userRepository.save(user)
  }

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, 8)
  }
}
