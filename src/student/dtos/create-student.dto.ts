import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Min,
  Max,
  IsMongoId,
} from 'class-validator';
import { Campus } from 'src/common/enums/campus.enum';

export class CreateStudentDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

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

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{9}$/, {
    message: 'Phone must be exactly 9 digits',
  })
  phone?: string;

  @IsEnum(Campus, {
    message: `Campus must be one of ${Object.values(Campus).join(', ')}`,
  })
  campus: Campus;

  @IsMongoId()
  program: string;

  @Min(1, {
    message: 'Current cycle must be at least 1',
  })
  @Max(20, {
    message: 'Current cycle must be at most 20',
  })
  currentCycle: number;
}
