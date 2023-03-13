import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dtos/create-user-dto';
import { EditUserDto } from './dtos/edit-user-dto';
import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь создан',
    type: UsersEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post('api')
  async create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  @ApiOperation({ summary: 'Рендер формы редактирования профиля пользователя' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('edit-profile/:id')
  @Render('edit-profile')
  async renderEditProfile(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const _user = await this.userService.findById(id);
    if (!_user) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Неверный идентификатор пользователя',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return _user;
  }

  @ApiOperation({ summary: 'Редактирование профиля пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Профиль пользователя отредактирован',
    type: UsersEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Not found.' })
  @Patch('api')
  @UseGuards(JwtAuthGuard)
  async edit(@Body() user: EditUserDto, @Req() req) {
    const jwtUserId = req.user.id;
    return this.userService.edit(jwtUserId, user);
  }
}
