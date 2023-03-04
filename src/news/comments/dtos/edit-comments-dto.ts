import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class EditCommentDto {
  @ValidateIf((o) => o.message !== undefined)
  @IsString()
  @IsNotEmpty()
  message: string;
}
