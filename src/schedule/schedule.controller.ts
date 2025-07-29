import { Body, Controller, Post } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { GetSchedulesDTO } from './dtos/get-schedules.dto';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  async getSchedulesForCourses(@Body() getSchedulesDTO: GetSchedulesDTO) {
    return this.scheduleService.findByCoursesIdGrouped(
      getSchedulesDTO.coursesId,
    );
  }
}
