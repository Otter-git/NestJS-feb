import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class CreateNewsDto {
  @ApiProperty({
    example: 'title',
    description: 'Заголовок новости',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'description',
    description: 'Описание новости',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example:
      'http://localhost:3000/news-static/19475603-4fec-466f-b632-348101503122.jpeg',
    description: 'Обложка новости',
  })
  @ValidateIf((o) => o.cover !== undefined)
  cover: string;
}
