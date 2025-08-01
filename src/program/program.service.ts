import { Program, ProgramDocument } from './schemas/program.schema';
import { Model } from 'mongoose';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProgramFound } from './interfaces/find-programs-response.interface';

@Injectable()
export class ProgramService {
  constructor(
    @InjectModel(Program.name) private programModel: Model<Program>,
  ) {}

  async allPrograms(): Promise<ProgramDocument[]> {
    const programs = await this.programModel.find({}, { courses: 0 });
    if (!programs || programs.length === 0) {
      throw new NotFoundException('No programs found');
    }
    return programs;
  }

  async findByCampus(campus: string): Promise<ProgramFound[]> {
    const programs = await this.programModel
      .find({ campus })
      .select('_id name');
    if (!programs || programs.length === 0) {
      throw new InternalServerErrorException('Error retrieving programs');
    }
    return programs.map((program) => {
      return {
        _id: program._id.toString(),
        name: program.name,
      };
    });
  }
}
