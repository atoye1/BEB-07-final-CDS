import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  readonly nickname: string;

  @IsEmail()
  @MaxLength(50)
  @MinLength(5)
  readonly email: string;
}
