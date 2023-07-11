import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersEntity } from '../../users/users.entity';
import { UsersService } from '../../users/users.service';
import { NewsEntity } from '../news.entity';
import { NewsService } from '../news.service';
import { CommentsController } from './comments.controller';
import { CommentsEntity } from './comments.entity';
import { CommentsService } from './comments.service';

describe('CommentsTest', () => {
  let controller: CommentsController;
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        CommentsService,
        UsersService,
        NewsService,
        EventEmitter2,
        {
          provide: getRepositoryToken(CommentsEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(NewsEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    controller = module.get<CommentsController>(CommentsController);
  });

  it('CommentsController should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('CommentsService should be defined', () => {
    expect(service).toBeDefined();
  });
});
