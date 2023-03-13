import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateIf } from 'class-validator';

export class EditNewsDto {
  @ApiProperty({
    example: 'title',
    description: 'Заголовок новости',
  })
  @ValidateIf((o) => o.title !== undefined)
  @IsString()
  title: string;

  @ApiProperty({
    example: 'description',
    description: 'Описание новости',
  })
  @ValidateIf((o) => o.description !== undefined)
  @IsString()
  description: string;

  @ApiProperty({
    example:
      'http://localhost:3000/news-static/19475603-4fec-466f-b632-348101503122.jpeg',
    description: 'Обложка новости',
  })
  @ValidateIf((o) => o.cover !== undefined)
  @IsString()
  cover: string;
}
