import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { NoAccesTokenNeeded } from './common/decorators/is-public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @NoAccesTokenNeeded()
  @Get('health')
  getHello(): string {
    return this.appService.getHealth();
  }
}
