import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsString,
  IsInt,
  Min,
  Max,
  MinLength,
  MaxLength,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  IsArray,
} from 'class-validator';
import { CreateCourseSelectionDTO } from './create-course-selection.dto';
import { CourseDataRenderDTO } from './render-data.dto';

export class CreateOwnScheduleDTO {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsInt()
  @Min(1)
  @Max(14)
  cycle: number;

  @ValidateNested({ each: true })
  @Type(() => CreateCourseSelectionDTO)
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  courseSelections: CreateCourseSelectionDTO[];

  @ValidateNested({ each: true })
  @Type(() => CourseDataRenderDTO)
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  renderData: CourseDataRenderDTO[];
}
