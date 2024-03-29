import { forwardRef, Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { CommentsModule } from './comments/comments.module';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './news.entity';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [NewsController],
  providers: [NewsService],
  imports: [
    TypeOrmModule.forFeature([NewsEntity]),
    forwardRef(() => CommentsModule),
    MailModule,
    UsersModule,
  ],
  exports: [TypeOrmModule.forFeature([NewsEntity]), NewsService],
})
export class NewsModule {}
