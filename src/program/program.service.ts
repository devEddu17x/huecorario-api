import { Program, ProgramDocument } from './schemas/program.schema';
import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

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
}
