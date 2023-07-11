import {
  Controller,
  Post,
  UseGuards,
  Request,
  Res,
  Get,
  Render,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    const { access_token, id, role } = await this.authService.login(req.user);
    response.cookie('jwt', access_token, { httpOnly: true });
    response.cookie('userId', id);
    response.cookie('role', role);
    return access_token;
  }

  @ApiOperation({ summary: 'Рендер формы авторизации пользователя' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Get('login')
  @Render('login')
  async renderLogin() {
    return { layout: 'auth', title: 'Авторизация' };
  }
}
