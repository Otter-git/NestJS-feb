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
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments/comments.service';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dtos/create-news-dto';
import { EditNewsDto } from './dtos/edit-news-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from '../utils/helper-file-loader';
import { MailService } from '../mail/mail.service';
import { NewsEntity } from './news.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

const PATH_NEWS = '/news-static/';
HelperFileLoader.path = PATH_NEWS;

@ApiBearerAuth()
@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentsService: CommentsService,
    private readonly mailService: MailService,
  ) {}

  @ApiOperation({ summary: 'Получение данных новости' })
  @ApiResponse({
    status: 200,
    description: 'Данные получены',
    type: NewsEntity,
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
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

  @ApiOperation({ summary: 'Получение данных списка новостей' })
  @ApiResponse({
    status: 200,
    description: 'Данные получены',
    type: NewsEntity,
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @Get('/api/all')
  async getAll(): Promise<NewsEntity[]> {
    return this.newsService.getAll();
  }

  @ApiOperation({ summary: 'Рендер списка новостей' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Get('/all')
  @Render('news-list')
  async getAllView() {
    const news = await this.newsService.getAll();
    return { news, title: 'Список новостей' };
  }

  @ApiOperation({ summary: 'Рендер формы создания новости' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Get('create/new')
  @Render('create-news')
  async createView() {
    return {};
  }

  @ApiOperation({ summary: 'Рендер формы редактирования новости' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Get('edit/:id')
  @Render('edit-news')
  async editView() {
    return {};
  }

  @ApiOperation({ summary: 'Рендер новости' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Not found.' })
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
    return { news };
  }

  @ApiOperation({ summary: 'Создание новости' })
  @ApiResponse({
    status: 201,
    description: 'Новость успешно создалась',
    type: NewsEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(JwtAuthGuard)
  @Post('/api')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: HelperFileLoader.destinationPath,
        filename: HelperFileLoader.customFileName,
      }),
      fileFilter: HelperFileLoader.fileFilterImages,
    }),
  )
  async create(
    @Body() news: CreateNewsDto,
    @UploadedFile() cover,
    @Req() req,
  ): Promise<NewsEntity> {
    const userId = req.user.id;

    if (cover?.filename) {
      news.cover = PATH_NEWS + cover.filename;
    }

    const createdNews = await this.newsService.create(news, userId);
    return createdNews;
  }

  @ApiOperation({ summary: 'Редактирование новости' })
  @ApiResponse({
    status: 201,
    description: 'Новость успешно отредактирована',
    type: NewsEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
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
    if (cover?.filename) {
      news.cover = PATH_NEWS + cover.filename;
    }
    const editedNews = await this.newsService.edit(id, news);
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

  @ApiOperation({ summary: 'Удаление новости' })
  @ApiResponse({ status: 200, description: 'Новость удалена' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
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
