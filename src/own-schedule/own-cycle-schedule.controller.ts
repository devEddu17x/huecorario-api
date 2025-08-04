import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { OwnScheduleService } from './services/own-cycle-schedule.service';
import { CreateOwnScheduleDTO } from './dtos/create-own-schema.dto';
import { CustomRequest } from 'src/auth/interfaces/custom-request.interface';
import { UpdateOwnScheduleDTO } from './dtos/update-own-schedule.dto';

@Controller('own-schedule')
export class OwnScheduleController {
  constructor(private readonly ownScheduleService: OwnScheduleService) {}

  @Post()
  async createOwnSchedule(
    @Body() createDTO: CreateOwnScheduleDTO,
    @Req() req: CustomRequest,
  ) {
    return this.ownScheduleService.create(createDTO, req.user._id);
  }

  @Patch(':id')
  async updateOwnSchedule(
    @Param('id') id: string,
    @Body() updateDTO: UpdateOwnScheduleDTO,
    @Req() req: CustomRequest,
  ) {
    return this.ownScheduleService.update(id, req.user._id, updateDTO);
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
