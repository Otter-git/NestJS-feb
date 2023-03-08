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
import { HelperFileLoader } from 'src/utils/helper-file-loader';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comments-dto';
import { EditCommentDto } from './dtos/edit-comments-dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

const PATH_NEWS = '/news-static/';
HelperFileLoader.path = PATH_NEWS;

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

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

  @Put('/api/:idComment')
  edit(
    @Param('idComment', ParseIntPipe) idComment: number,
    @Body() comment: EditCommentDto,
  ) {
    return this.commentsService.edit(idComment, comment);
  }

  @Get('/api/:idNews')
  get(@Param('idNews', ParseIntPipe) idNews: number) {
    return this.commentsService.findAll(idNews);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/api/:idComment')
  remove(@Param('idComment', ParseIntPipe) idComment: number, @Req() req) {
    const userId = req.user.id;
    return this.commentsService.remove(idComment, userId);
  }
}
