import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as expressHbs from 'express-handlebars';
import * as hbs from 'hbs';
import { AppModule } from './app.module';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API новостного блога')
    .setDescription('Все методы по взаимодействию')
    .setVersion('1.0')
    .addTag('news, user, comments')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());

  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.use(cookieParser());
  app.engine(
    'hbs',
    expressHbs({
      layoutsDir: join(__dirname, '..', 'views/layouts'),
      defaultLayout: 'layout',
      extname: 'hbs',
    }),
  );

  hbs.registerPartials(__dirname + '/views/partials');
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();
