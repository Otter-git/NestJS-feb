import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { News, NewsEdit, NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('detail/:id')
  get(@Param('id') id: string): News {
    const idInt = parseInt(id);
    return this.newsService.find(idInt);
  }

  @Get('/all')
  getAll(): News[] {
    return this.newsService.getAll();
  }

  @Post()
  create(@Body() news: News): News {
    return this.newsService.create(news);
  }

  @Post('/:id')
  edit(@Param('id') id: string, @Body() news: NewsEdit): News {
    const idInt = parseInt(id);
    return this.newsService.edit(idInt, news);
  }

  @Delete('/:id')
  remove(@Param('id') id: string): string {
    const idInt = parseInt(id);
    const isRemove = this.newsService.remove(idInt);
    return isRemove ? 'Новость удалена' : 'Передан неверный идентификатор';
  }
}
