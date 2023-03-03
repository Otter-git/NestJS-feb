import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user-dto';
import { UsersEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async create(user: CreateUserDto) {
    const usersEntity = new UsersEntity();
    usersEntity.firstName = user.firstName;

    return this.usersRepository.save(usersEntity);
  }

  async findById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }
}
