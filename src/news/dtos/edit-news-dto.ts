import { IsNumber, IsString, ValidateIf } from 'class-validator';

export class EditNewsDto {
  @ValidateIf((o) => o.title !== undefined)
  @IsString()
  title: string;

  @ValidateIf((o) => o.description !== undefined)
  @IsString()
  description: string;

  @ValidateIf((o) => o.author !== undefined)
  @IsString()
  author: string;

  @ValidateIf((o) => o.countView !== undefined)
  @IsNumber()
  countView: number;

  @ValidateIf((o) => o.cover !== undefined)
  @IsString()
  cover: string;
}
