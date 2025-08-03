import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { OwnScheduleService } from './services/own-cycle-schedule.service';
import { CreateOwnScheduleDTO } from './dtos/create-own-schema.dto';
import { CustomRequest } from 'src/auth/interfaces/custom-request.interface';

@Controller('own-schedule')
export class OwnScheduleController {
  constructor(private readonly ownScheduleService: OwnScheduleService) {}

  @Post()
  async createOwnSchedule(@Body() createDTO: CreateOwnScheduleDTO) {
    return this.ownScheduleService.create(createDTO);
  }

  @Get(':id')
  async getOwnSchedule(@Param('id') id: string) {
    return this.ownScheduleService.getById(id);
  }

  @Get()
  async getOwnScheduleByCycle(
    @Query('cycle', ParseIntPipe) cycle: number,
    @Req() req: CustomRequest,
  ) {
    return this.ownScheduleService.getBasicByUserIdAndCycle(
      req.user._id,
      cycle,
    );
  }
}
