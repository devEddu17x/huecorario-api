import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthLoginDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  @MaxLength(30, {
    message: 'Password must be at most 30 characters long',
  })
  password: string;
}
