import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CommentsService } from './comments/comments.service';
import { News, NewsService } from './news.service';
import { renderNewsAll } from 'src/views/news/news-all';
import { renderTemplate } from 'src/views/template';
import { renderNewsDetails } from '../views/news/news-detail';
import { CreateNewsDto } from './dtos/create-news-dto';
import { EditNewsDto } from './dtos/edit-news-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HelperFileLoader } from 'src/utils/helper-file-loader';

const PATH_NEWS = '/news-static/';
HelperFileLoader.path = PATH_NEWS;

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly commentsService: CommentsService,
  ) {}

  @Get('/api/detail/:id')
  get(@Param('id') id: string): News {
    const idInt = parseInt(id);
    const news = this.newsService.find(idInt);
    const comments = this.commentsService.find(idInt);

    return {
      ...news,
      comments,
    };
  }

  @Get('/api/all')
  getAll(): News[] {
    return this.newsService.getAll();
  }

  @Get('/all')
  getAllView() {
    const news = this.newsService.getAll();
    const content = renderNewsAll(news);
    return renderTemplate(content, {
      title: 'Список новостей',
      description: 'Коты',
    });
  }

  @Get('/:id/detail')
  getDetails(@Param('id') id: string) {
    const idInt = parseInt(id);
    const news = this.newsService.find(idInt);
    const comments = this.commentsService.find(idInt);
    const content = renderNewsDetails(news, comments);
    return renderTemplate(content, {
      title: `Новость ${idInt}`,
      description: `${news.description}`,
    });
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
  create(
    @Body() news: CreateNewsDto,
    @UploadedFile() cover: Express.Multer.File,
  ): News {
    if (cover?.filename) {
      news.cover = PATH_NEWS + cover.filename;
    }

    return this.newsService.create(news);
  }

  @Post('/api/:id')
  edit(@Param('id') id: string, @Body() news: EditNewsDto): News {
    const idInt = parseInt(id);
    return this.newsService.edit(idInt, news);
  }

  @Delete('/api/:id')
  remove(@Param('id') id: string): string {
    const idInt = parseInt(id);
    const isRemove = this.newsService.remove(idInt);
    return isRemove ? 'Новость удалена' : 'Передан неверный идентификатор';
  }
}
