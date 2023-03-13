import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from '../../users/users.entity';
import { NewsEntity } from '../news.entity';

@Entity('comments')
export class CommentsEntity {
  @ApiProperty({
    example: 1,
    description: 'Идентификатор комментария',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Комментарий к новости',
    description: 'Сообщение',
  })
  @Column('text')
  message: string;

  @ApiProperty({
    type: () => UsersEntity,
    description: 'Данные пользователя',
  })
  @ManyToOne(() => UsersEntity, (user) => user.comments)
  user: UsersEntity;

  @ApiProperty({
    type: () => NewsEntity,
    description: 'Данные новости',
  })
  @ManyToOne(() => NewsEntity, (news) => news.comments)
  news: NewsEntity;

  @ApiProperty({
    example: '2023-03-09T14:28:40.797Z',
    description: 'Дата создания',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    example: '2023-03-09T14:28:40.797Z',
    description: 'Дата создания',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
