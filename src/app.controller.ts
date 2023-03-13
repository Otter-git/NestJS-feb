import { Controller, Get, Render } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { JwtCookie } from './auth/jwt.decorator';

@Controller('/app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Hello page' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Get('/hello')
  getHello(@JwtCookie() jwt): string {
    return this.appService.getHello();
  }

  @ApiOperation({ summary: 'Hello message' })
  @ApiResponse({ status: 200, description: 'Success' })
  @Get()
  @Render('index')
  root() {
    return {
      messages: [{ message: 'Hello' }, { message: 'World' }],
    };
  }
}
