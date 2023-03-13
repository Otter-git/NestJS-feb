import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  Delete,
  ParseIntPipe,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { HelperFileLoader } from '../../utils/helper-file-loader';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comments-dto';
import { EditCommentDto } from './dtos/edit-comments-dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommentsEntity } from './comments.entity';

const PATH_NEWS = '/news-static/';
HelperFileLoader.path = PATH_NEWS;

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Создание комментария' })
  @ApiResponse({
    status: 201,
    description: 'Комментарий создан',
    type: CommentsEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @Post('/api/:idNews')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('idNews', ParseIntPipe) idNews: number,
    @Body() comment: CreateCommentDto,
    @Req() req,
  ) {
    const jwtUserId = req.user.userId;
    return this.commentsService.create(idNews, comment.message, jwtUserId);
  }

  @ApiOperation({ summary: 'Редактирование комментария' })
  @ApiResponse({
    status: 200,
    description: 'Комментарий отредактирован',
    type: CommentsEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @Put('/api/:idComment')
  edit(
    @Param('idComment', ParseIntPipe) idComment: number,
    @Body() comment: EditCommentDto,
  ) {
    return this.commentsService.edit(idComment, comment);
  }

  @ApiOperation({ summary: 'Получение данных списка комментариев' })
  @ApiResponse({
    status: 200,
    description: 'Данные получены',
    type: CommentsEntity,
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @Get('/api/:idNews')
  get(@Param('idNews', ParseIntPipe) idNews: number) {
    return this.commentsService.findAll(idNews);
  }

  @ApiOperation({ summary: 'Удаление комментария' })
  @ApiResponse({
    status: 200,
    description: 'Комментарий удален',
    type: CommentsEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseGuards(JwtAuthGuard)
  @Delete('/api/:idComment')
  remove(@Param('idComment', ParseIntPipe) idComment: number, @Req() req) {
    const userId = req.user.id;
    return this.commentsService.remove(idComment, userId);
  }
}
