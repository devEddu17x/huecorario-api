import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OwnSchedule } from './schemas/own-schedule.schema';
import { Model } from 'mongoose';
import { CreateOwnScheduleDTO } from './dtos/create-own-schema.dto';

@Injectable()
export class OwnScheduleService {
  constructor(
    @InjectModel(OwnSchedule.name) private ownScheduleModel: Model<OwnSchedule>,
  ) {}

  async create(createDTO: CreateOwnScheduleDTO): Promise<any> {
    try {
      const ownSchedule = new this.ownScheduleModel(createDTO);
      const result = await this.ownScheduleModel.insertOne(ownSchedule);
      if (!result._id) {
        throw new BadRequestException(`Failed to create own schedule`);
      }
      return { _id: result._id };
    } catch (error) {
      throw new BadRequestException(`Error creating own schedule`);
    }
  }
}
