import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { Role } from '../../auth/role/role.enum';

export class EditUserDto {
  @ApiProperty({
    example: 'Name',
    description: 'Имя пользователя',
  })
  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.firstName)
  firstName: string;

  @ApiProperty({
    example: 'name@mail.ru',
    description: 'Email пользователя',
  })
  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.email)
  email: string;

  @ApiProperty({
    example: 'password',
    description: 'Пароль пользователя',
  })
  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.password)
  password: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.roles)
  roles: Role;
}
