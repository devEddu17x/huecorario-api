import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  Matches,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DAYS } from '../enums/days.enum';
import { CourseData } from '../interfaces/course-data.interface';

const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

export class CourseDataRenderDTO implements CourseData {
  @IsString()
  @IsNotEmpty()
  course: string;

  @IsEnum(DAYS, {
    message: `Campus must be one of ${Object.values(DAYS).join(', ')}`,
  })
  day: DAYS;

  @IsString()
  @IsNotEmpty()
  @Matches(timeRegex, {
    message: 'El formato de la hora de inicio debe ser HH:mm',
  })
  start: string;

  @IsString()
  @IsNotEmpty()
  @Matches(timeRegex, {
    message: 'El formato de la hora de fin debe ser HH:mm',
  })
  end: string;
}
