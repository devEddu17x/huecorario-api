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

  async allPrograms(): Promise<ProgramFound[]> {
    const programs = await this.programModel
      .find({}, { courses: 0 })
      .select('_id name campus -__v');

    if (!programs || programs.length === 0) {
      throw new NotFoundException('No programs found');
    }

    return programs.map((program) => ({
      _id: program._id.toString(),
      name: program.name,
      campus: program.campus,
    }));
  }

  async findByCampus(campus: string): Promise<ProgramFound[]> {
    const programs = await this.programModel
      .find({ campus })
      .select('_id name');
    if (!programs || programs.length === 0) {
      throw new NotFoundException(`No programs found for campus ${campus}`);
    }
    return programs.map((program) => {
      return {
        _id: program._id.toString(),
        name: program.name,
      };
    });
  }
}
