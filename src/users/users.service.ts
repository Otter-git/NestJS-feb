import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { checkPermission, Modules } from 'src/auth/role/utils/check-permission';
import { hash } from 'src/utils/crypto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user-dto';
import { EditUserDto } from './dtos/edit-user-dto';
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
    usersEntity.email = user.email;
    usersEntity.roles = user.roles;
    usersEntity.password = await hash(user.password);

    return this.usersRepository.save(usersEntity);
  }

  async edit(id: number, user: EditUserDto) {
    const _user = await this.findById(id);
    if (!_user) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Неверный идентификатор пользователя',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    _user.firstName = user.firstName || _user.firstName;
    _user.email = user.email || _user.email;

    if (checkPermission(Modules.changeRole, _user.roles)) {
      _user.roles = user.roles || _user.roles;
    }
    _user.password = (await hash(user.password)) || _user.password;

    return this.usersRepository.save(_user);
  }

  async findById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  async findByEmail(email): Promise<UsersEntity> {
    return await this.usersRepository.findOneBy({ email });
  }
}
