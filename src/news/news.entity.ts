import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntity } from '../users/users.entity';
import { CommentsEntity } from './comments/comments.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('news')
export class NewsEntity {
  @ApiProperty({
    example: 1,
    description: 'Идентификатор новости',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'title',
    description: 'Заголовок новости',
  })
  @Column('text')
  title: string;

  @ApiProperty({
    example: 'description',
    description: 'Описание новости',
  })
  @Column('text')
  description: string;

  @ApiProperty({
    example:
      'http://localhost:3000/news-static/19475603-4fec-466f-b632-348101503122.jpeg',
    description: 'Обложка новости',
  })
  @Column('text', { nullable: true })
  cover: string;

  @ApiProperty({
    type: () => UsersEntity,
    description: 'Данные пользователя',
  })
  @ManyToOne(() => UsersEntity, (user) => user.news)
  user: UsersEntity;

  @ApiProperty({
    type: () => CommentsEntity,
    description: 'Данные комментариев',
  })
  @OneToMany(() => CommentsEntity, (comments) => comments.news)
  comments: CommentsEntity[];

  @ApiProperty({
    example: '2023-03-09T14:28:40.797Z',
    description: 'Дата создания',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    example: '2023-03-09T14:28:40.797Z',
    description: 'Дата последнего изменения',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
