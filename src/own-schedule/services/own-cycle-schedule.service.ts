import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OwnSchedule } from '../schemas/own-schedule.schema';
import { Model } from 'mongoose';
import { CreateOwnScheduleDTO } from '../dtos/create-own-schema.dto';
import { ScheduleBasicData } from '../interfaces/basic-data.interface';

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

  async getById(id: string): Promise<OwnSchedule | null> {
    try {
      const ownSchedule = await this.ownScheduleModel
        .findById(id)
        .populate({
          path: 'courseSelections.schedules',
          populate: {
            path: 'blocks.teacher',
            select: 'id name',
          },
        })
        .exec();

      if (!ownSchedule) {
        throw new NotFoundException(`Own schedule with id ${id} not found`);
      }
      return ownSchedule;
    } catch (error) {
      throw new BadRequestException(
        `Error fetching own schedule with id ${id}: ${error.message}`,
      );
    }
  }

  async getBasicByUserIdAndCycle(
    studentId: string,
    cycle: number,
  ): Promise<ScheduleBasicData[]> {
    try {
      const basicData = await this.ownScheduleModel
        .find({ student_id: studentId, cycle })
        .select('_id name previewImageUrl updatedAt');
      return basicData.map((schedule) => ({
        _id: schedule._id.toString(),
        name: schedule.name,
        previewImageUrl: schedule.previewImageUrl || '',
        updatedAt: (schedule as any).updatedAt,
      }));
    } catch (error) {
      throw new BadRequestException(`Error fetching own schedules`);
    }
  }
}
