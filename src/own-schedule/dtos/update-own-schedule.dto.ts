import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateCourseSelectionDTO } from './create-course-selection.dto';
import { CourseDataRenderDTO } from './render-data.dto';

export class UpdateOwnScheduleDTO {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateCourseSelectionDTO)
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  courseSelections?: CreateCourseSelectionDTO[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CourseDataRenderDTO)
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  renderData?: CourseDataRenderDTO[];
}
