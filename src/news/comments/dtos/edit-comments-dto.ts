import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class EditCommentDto {
  @ApiProperty({
    example: 'message',
    description: 'Текст комментария',
  })
  @ValidateIf((o) => o.message !== undefined)
  @IsString()
  @IsNotEmpty()
  message: string;
}
