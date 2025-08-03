import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { GetSchedulesDTO } from './dtos/get-schedules.dto';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @HttpCode(200)
  @Post()
  async getSchedulesForCourses(@Body() getSchedulesDTO: GetSchedulesDTO) {
    const schedules =
      await this.scheduleService.findByCoursesIdGroupedWithAggregation(
        getSchedulesDTO.coursesId,
      );
    if (!schedules || Object.keys(schedules).length === 0) {
      throw new NotFoundException(
        'Schedules not found for the provided courses.',
      );
    }
    return schedules;
  }
}
