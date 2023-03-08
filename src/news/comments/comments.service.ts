import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { NewsService } from '../news.service';
import { CommentsEntity } from './comments.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventsComment } from './EventComment.enum';
import {
  checkPermission,
  Modules,
} from '../../auth/role/utils/check-permission';

export type Comment = {
  id?: number;
  message: string;
  author: string;
};

export type CommentEdit = {
  message: string;
  author?: string;
};

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
    private readonly newsService: NewsService,
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    idNews: number,
    message: string,
    idUser: number,
  ): Promise<CommentsEntity> {
    const _news = await this.newsService.findById(idNews);
    if (!_news) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Новость не найдена',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const _user = await this.usersService.findById(idUser);

    if (!_user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Пользователь не найден',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const commentEntity = new CommentsEntity();
    commentEntity.news = _news;
    commentEntity.message = message;
    commentEntity.user = _user;

    return this.commentsRepository.save(commentEntity);
  }

  async findAll(idNews: number): Promise<CommentsEntity[]> {
    return this.commentsRepository.find({
      where: { news: { id: idNews } },
      relations: ['user'],
    });
  }

  async edit(idComment: number, comment: CommentEdit): Promise<CommentsEntity> {
    const _comment = await this.commentsRepository.findOne({
      where: { id: idComment },
      relations: ['news', 'user'],
    });
    _comment.message = comment.message;
    const _updatedComment = await this.commentsRepository.save(_comment);
    this.eventEmitter.emit(EventsComment.edit, {
      commentId: idComment,
      newsId: _comment.news.id,
      comment: _updatedComment,
    });
    return _updatedComment;
  }

  async remove(idComment: number, userId: number): Promise<CommentsEntity> {
    const _comment = await this.commentsRepository.findOne({
      where: { id: idComment },
      relations: ['news', 'user'],
    });
    if (!_comment) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Комментарий не найден',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const _user = await this.usersService.findById(userId);
    if (
      _user.id !== _comment.user.id &&
      !checkPermission(Modules.editComment, _user.roles)
    ) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Недостаточно прав для удаления',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    const comment = await this.commentsRepository.remove(_comment);
    this.eventEmitter.emit(EventsComment.remove, {
      commentId: idComment,
      newsId: _comment.news.id,
    });

    return comment;
  }

  async removeAll(idNews) {
    const _comments = await this.findAll(idNews);
    return await this.commentsRepository.remove(_comments);
  }
}
