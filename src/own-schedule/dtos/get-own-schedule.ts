import { IsMongoId } from 'class-validator';

export class GetScheduleDTO {
  @IsMongoId()
  _id: string;
}
