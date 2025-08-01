import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { CourseService } from './course.service';
import { Course } from './schema/course.schema';
import { CourseFound } from './interfaces/course-found.interface';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get(':programId')
  async findByProgramId(
    @Param('programId') programId: string,
  ): Promise<CourseFound[] | null> {
    const courses = await this.courseService.findByProgramId(programId);
    if (!courses || courses.length === 0) {
      throw new NotFoundException(
        `No courses found for program ID ${programId}`,
      );
    }
    return courses;
  }
}
