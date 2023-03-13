import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'message',
    description: 'Текст комментария',
  })
  @IsNotEmpty()
  @IsString()
  message: string;
}
