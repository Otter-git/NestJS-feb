import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Render,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from './comments/comments.service';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dtos/create-news-dto';
import { EditNewsDto } from './dtos/edit-news-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from 'src/utils/helper-file-loader';
import { MailService } from '../mail/mail.service';
import { NewsEntity } from './news.entity';

const PATH_NEWS = '/news-static/';
HelperFileLoader.path = PATH_NEWS;

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentsService: CommentsService,
    private readonly mailService: MailService,
  ) {}

  @Get('/api/detail/:id')
  async get(@Param('id', ParseIntPipe) id: number): Promise<NewsEntity> {
    const news = this.newsService.findById(id);
    if (!news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новость не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return news;
  }

  @Get('/api/all')
  async getAll(): Promise<NewsEntity[]> {
    return this.newsService.getAll();
  }

  @Get('/all')
  @Render('news-list')
  async getAllView() {
    const news = await this.newsService.getAll();
    return { news, title: 'Список новостей' };
  }

  @Get('create/new')
  @Render('create-news')
  async createView() {
    return {};
  }

  @Get('edit/:id')
  @Render('edit-news')
  async editView() {
    return {};
  }

  @Get('/:id/detail')
  @Render('news-detail')
  async getDetails(@Param('id', ParseIntPipe) id: number) {
    const news = await this.newsService.findById(id);
    if (!news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новость не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const comments = this.commentsService.find(id);
    return {
      news,
      comments,
    };
  }

  @Post('/api')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: HelperFileLoader.destinationPath,
        filename: HelperFileLoader.customFileName,
      }),
    }),
  )
  async create(
    @Body() news: CreateNewsDto,
    @UploadedFile() cover,
  ): Promise<NewsEntity> {
    const fileExtension = cover.originalname.split('.').reverse()[0];
    if (!fileExtension || !fileExtension.match(/(jpg|jpeg|png|gif)$/)) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Неверный тип файла',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (cover?.filename) {
      news.cover = PATH_NEWS + cover.filename;
    }

    const createdNews = await this.newsService.create(news);
    return createdNews;
  }

  @Post('/api/:id')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: HelperFileLoader.destinationPath,
        filename: HelperFileLoader.customFileName,
      }),
    }),
  )
  async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() news: EditNewsDto,
    @UploadedFile() cover,
  ): Promise<NewsEntity> {
    if (cover) {
      const fileExtension = cover.originalname.split('.').reverse()[0];
      if (!fileExtension || !fileExtension.match(/(jpg|jpeg|png|gif)$/)) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Неверный тип файла',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    if (cover?.filename) {
      news.cover = PATH_NEWS + cover.filename;
    }
    const editedNews = this.newsService.edit(id, news);
    if (!editedNews) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новость не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return editedNews;
  }

  @Delete('/api/:id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<string> {
    const isRemoved = await this.newsService.remove(id);
    throw new HttpException(
      {
        status: HttpStatus.OK,
        error: isRemoved ? 'Новость удалена' : 'Передан неверный идентификатор',
      },
      HttpStatus.OK,
    );
  }
}
