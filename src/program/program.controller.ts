import { Controller, Get } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramDocument } from './schemas/program.schema';

@Controller('programs')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Get()
  async findAll(): Promise<ProgramDocument[]> {
    return this.programService.allPrograms();
  }
}
