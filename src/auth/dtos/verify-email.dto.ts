import { IsEmail, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class VerifyEmailDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(100000, { message: 'Verification code must be at least 6 digits' })
  @Max(999999, { message: 'Verification code must be at most 6 digits' })
  verificationCode: number;
}
