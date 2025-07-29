import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsString,
  MinLength,
  MaxLength,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';

export class CreateCourseSelectionDTO {
  @IsMongoId()
  course: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  courseName: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsMongoId({ each: true })
  schedules: string[];
}
