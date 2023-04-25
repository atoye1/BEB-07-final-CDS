import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  readonly nickname?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(50)
  @MinLength(5)
  readonly email?: string;
}
