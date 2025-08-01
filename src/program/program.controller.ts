import { Controller, Get, ParseEnumPipe, Query } from '@nestjs/common';
import { ProgramService } from './program.service';
import { Campus } from 'src/common/enums/campus.enum';
import { ProgramFound } from './interfaces/find-programs-response.interface';
import { NoAccesTokenNeeded } from 'src/common/decorators/is-public.decorator';

@Controller('programs')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @NoAccesTokenNeeded()
  @Get()
  async getByCampus(
    @Query('campus', new ParseEnumPipe(Campus)) campus: Campus,
  ): Promise<ProgramFound[]> {
    return this.programService.findByCampus(campus);
  }
}
