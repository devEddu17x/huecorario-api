import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './schema/course.schema';
import { Model } from 'mongoose';
import { CourseFound } from './interfaces/course-found.interface';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

  async findByProgramId(programId: string): Promise<CourseFound[] | null> {
    const courses: CourseFound[] = await this.courseModel
      .find({ program: programId })
      .select('_id codeNumber name hasSchedules type');
    if (!courses || courses.length === 0) {
      return null;
    }
    return courses;
  }
}
