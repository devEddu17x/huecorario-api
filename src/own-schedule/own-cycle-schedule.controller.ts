import { Body, Controller, Post } from '@nestjs/common';
import { OwnScheduleService } from './own-cycle-schedule.service';
import { CreateOwnScheduleDTO } from './dtos/create-own-schema.dto';

@Controller('own-schedule')
export class OwnScheduleController {
  constructor(private readonly ownScheduleService: OwnScheduleService) {}

  @Post()
  async createOwnSchedule(@Body() createDTO: CreateOwnScheduleDTO) {
    return this.ownScheduleService.create(createDTO);
  }
}
