import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppTest', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
    controller = app.get<AppController>(AppController);
  });

  it('AppController should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('AppService should be defined', () => {
    expect(service).toBeDefined();
  });
});
