import { Module } from '@nestjs/common';
import { OwnScheduleService } from './services/own-cycle-schedule.service';
import { OwnScheduleController } from './own-cycle-schedule.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OwnSchedule, OwnScheduleSchema } from './schemas/own-schedule.schema';
import { SvgGeneratorService } from './services/svg-generator.service';
import { StorageModule } from 'src/storage/storage.module';
import { ConfigModule } from '@nestjs/config';
import { SignatureModule } from 'src/signature/signature.module';
import { ScheduleModule } from 'src/schedule/schedule.module';

@Module({
  imports: [
    ConfigModule,
    StorageModule,
    SignatureModule,
    ScheduleModule,
    MongooseModule.forFeature([
      { name: OwnSchedule.name, schema: OwnScheduleSchema },
    ]),
  ],
  providers: [OwnScheduleService, SvgGeneratorService],
  controllers: [OwnScheduleController],
  exports: [OwnScheduleService],
})
export class OwnScheduleModule {}
