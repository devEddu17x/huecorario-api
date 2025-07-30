import { Module } from '@nestjs/common';
import { OwnScheduleService } from './own-cycle-schedule.service';
import { OwnScheduleController } from './own-cycle-schedule.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OwnSchedule, OwnScheduleSchema } from './schemas/own-schedule.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OwnSchedule.name, schema: OwnScheduleSchema },
    ]),
  ],
  providers: [OwnScheduleService],
  controllers: [OwnScheduleController],
  exports: [OwnScheduleService],
})
export class OwnScheduleModule {}
