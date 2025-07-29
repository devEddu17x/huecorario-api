import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './schema/course.schema';
import { Model } from 'mongoose';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

  async findByProgramId(programId: string): Promise<Course[] | null> {
    return this.courseModel.find({ program: programId }, { schedules: 0 });
  }
}
