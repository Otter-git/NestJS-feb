import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({ summary: 'Отправка письма установки' })
  @Get()
  async sendTestEmail() {
    return await this.mailService.sendTest();
  }
}
