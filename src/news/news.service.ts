import { Injectable } from '@nestjs/common';
import { Comment } from './comments/comments.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from './news.entity';
import { CreateNewsDto } from './dtos/create-news-dto';
import { UsersService } from 'src/users/users.service';

export interface News {
  id?: number;
  title: string;
  description: string;
  author: string;
  countView?: number;
  comments?: Comment[];
  cover?: string;
}

export interface NewsEdit {
  title?: string;
  description?: string;
  author?: string;
  countView?: number;
  cover?: string;
}

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsEntity)
    private newsRepository: Repository<NewsEntity>,
    private usersService: UsersService,
  ) {}

  async create(news: CreateNewsDto, userId: number): Promise<NewsEntity> {
    const newsEntity = new NewsEntity();
    newsEntity.title = news.title;
    newsEntity.description = news.description;
    newsEntity.cover = news.cover;
    const _user = await this.usersService.findById(userId);
    newsEntity.user = _user;
    return this.newsRepository.save(newsEntity);
  }

  findById(id: News['id']): Promise<NewsEntity> {
    return this.newsRepository.findOne({
      where: { id: id },
      relations: ['user', 'comments', 'comments.user'],
    });
  }

  async edit(id: number, news: NewsEdit): Promise<NewsEntity | null> {
    const editableNews = await this.findById(id);
    if (editableNews) {
      editableNews.description = news.description || editableNews.description;
      editableNews.title = news.title || editableNews.title;
      editableNews.cover = news.cover || editableNews.cover;

      return this.newsRepository.save(editableNews);
    }
    return null;
  }

  getAll(): Promise<NewsEntity[]> {
    return this.newsRepository.find({});
  }

  async remove(id: News['id']): Promise<NewsEntity | null> {
    const removeNews = await this.findById(id);
    if (removeNews) {
      return this.newsRepository.remove(removeNews);
    }
    return null;
  }
}
