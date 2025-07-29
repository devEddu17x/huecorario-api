import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Program, ProgramSchema } from './schemas/program.schema';
import { ProgramController } from './program.controller';
import { ProgramService } from './program.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Program.name, schema: ProgramSchema }]),
  ],
  providers: [ProgramService],
  controllers: [ProgramController],
})
export class ProgramModule {}
