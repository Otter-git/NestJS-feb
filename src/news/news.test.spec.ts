import { MailerService } from '@nestjs-modules/mailer';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MailService } from '../mail/mail.service';
import { UsersEntity } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { CommentsEntity } from './comments/comments.entity';
import { CommentsService } from './comments/comments.service';
import { NewsController } from './news.controller';
import { NewsEntity } from './news.entity';
import { NewsService } from './news.service';

describe('NewsTest', () => {
  let controller: NewsController;
  let service: NewsService;
  let sendUserVerficationEmailMock;

  beforeEach(async () => {
    sendUserVerficationEmailMock = jest
      .fn()
      .mockImplementation(() => console.log('email sent'));
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsController],
      providers: [
        NewsService,
        UsersService,
        CommentsService,
        EventEmitter2,
        MailService,
        MailerService,
        {
          provide: getRepositoryToken(NewsEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(CommentsEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(UsersEntity),
          useValue: {},
        },
        {
          name: 'MAILER_OPTIONS',
          provide: 'MAILER_OPTIONS',
          useValue: [],
        },
      ],
    })
      .overrideProvider(MailerService)
      .useValue({
        sendUserVerficationEmail: sendUserVerficationEmailMock,
      })
      .compile();

    service = module.get<NewsService>(NewsService);
    controller = module.get<NewsController>(NewsController);
  });

  describe('getAll', () => {
    it('should return an array of news', async () => {
      const result = Promise['test'];
      jest.spyOn(service, 'getAll').mockImplementation(() => result);

      expect(await controller.getAll()).toBe(result);
    });
  });

  it('NewsController should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('NewsService should be defined', () => {
    expect(service).toBeDefined();
  });
});
