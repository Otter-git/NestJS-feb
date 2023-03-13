import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { UsersController } from './users.controller';
import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';

describe('UsersTest', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        JwtService,
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  it('UsersService should be defined', () => {
    expect(service).toBeDefined();
  });

  it('UsersController should be defined', () => {
    expect(controller).toBeDefined();
  });
});
