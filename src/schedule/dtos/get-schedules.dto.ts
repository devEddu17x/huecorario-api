import {
  IsArray,
  ArrayNotEmpty,
  IsString,
  ArrayMaxSize,
} from 'class-validator';

export class GetSchedulesDTO {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  coursesId: string[];
}
