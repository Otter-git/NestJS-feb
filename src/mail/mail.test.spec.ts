import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

describe('MailTest', () => {
  let controller: MailController;
  let service: MailService;
  let sendUserVerficationEmailMock;

  beforeEach(async () => {
    sendUserVerficationEmailMock = jest
      .fn()
      .mockImplementation(() => console.log('email sent'));
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailController],
      providers: [
        MailService,
        MailerService,
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

    service = module.get<MailService>(MailService);
    controller = module.get<MailController>(MailController);
  });

  it('MailController should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('MailService should be defined', () => {
    expect(service).toBeDefined();
  });
});
