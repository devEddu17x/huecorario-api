import { Controller, Get, Param } from '@nestjs/common';
import { CourseService } from './course.service';
import { Course } from './schema/course.schema';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get(':programId')
  async findByProgramId(
    @Param('programId') programId: string,
  ): Promise<Course[]> {
    return this.courseService.findByProgramId(programId);
  }
}
