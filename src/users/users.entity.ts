import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Role } from '../auth/role/role.enum';
import { CommentsEntity } from '../news/comments/comments.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NewsEntity } from '../news/news.entity';

@Entity('users')
export class UsersEntity {
  @ApiProperty({
    example: 1,
    description: 'Идентификатор пользователя',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Name',
    description: 'Имя пользователя',
  })
  @Column('text')
  firstName: string;

  @ApiProperty({
    example: 'name@mail.ru',
    description: 'Email пользователя',
  })
  @Column('text')
  email: string;

  @ApiProperty({
    example: 'password',
    description: 'Пароль пользователя',
  })
  @Column('text')
  password: string;

  @ApiProperty({
    enum: Role,
    description: 'Права пользователя',
  })
  @Column('text')
  @IsEnum(Role)
  roles: Role;

  @OneToMany(() => NewsEntity, (news) => news.user)
  news: NewsEntity[];

  @OneToMany(() => CommentsEntity, (comments) => comments.user)
  comments: CommentsEntity[];

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
