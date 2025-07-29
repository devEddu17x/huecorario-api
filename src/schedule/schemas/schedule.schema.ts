import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Block, BlockSchema } from './block.schema';

export type ScheduleDocument = HydratedDocument<Schedule>;

@Schema({
  timestamps: true,
  collection: 'schedules',
})
export class Schedule {
  @Prop({
    required: true,
    unique: false,
  })
  nrc: number;

  @Prop({
    required: true,
    trim: true,
    uppercase: true,
  })
  section: string;

  @Prop({
    trim: true,
  })
  idLeague: string;

  @Prop({
    trim: true,
  })
  league: string;

  @Prop({
    required: true,
    min: 0,
  })
  credits: number;

  @Prop({
    min: 0,
  })
  h: number;

  @Prop({
    min: 0,
  })
  ht: number;

  @Prop({
    min: 0,
  })
  pp: number;

  @Prop({
    required: true,
    min: 0,
  })
  capacity: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true,
  })
  course: Types.ObjectId;

  @Prop([BlockSchema])
  blocks: Block[];
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
