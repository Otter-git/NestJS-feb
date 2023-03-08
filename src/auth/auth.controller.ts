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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) response: Response) {
    console.log('login');
    const { access_token, id, role } = await this.authService.login(req.user);
    response.cookie('jwt', access_token, { httpOnly: true });
    response.cookie('userId', id);
    response.cookie('role', role);
    return access_token;
  }

  @Get('login')
  @Render('login')
  async renderLogin() {
    return { layout: 'auth', title: 'Авторизация' };
  }
}
