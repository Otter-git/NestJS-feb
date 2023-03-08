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

  @ManyToOne(() => UsersEntity, (user) => user.news)
  user: UsersEntity;

  @OneToMany(() => CommentsEntity, (comments) => comments.news)
  comments: CommentsEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
