import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import {
  CourseSelection,
  CourseSelectionSchema,
} from './courses-selection.schema';

@Schema({ timestamps: true, collection: 'own-schedules' })
export class OwnSchedule {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  })
  student_id: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 100,
  })
  name: string;

  @Prop({
    required: true,
    min: 1,
    max: 14,
  })
  cycle: number;

  @Prop()
  previewImageUrl?: string;

  @Prop([CourseSelectionSchema])
  courseSelections: CourseSelection[];
}

export const OwnScheduleSchema = SchemaFactory.createForClass(OwnSchedule);

export type OwnScheduleDocumentOverride = {
  name: Types.DocumentArray<CourseSelection>;
};

export type OwnScheduleDocument = HydratedDocument<
  OwnSchedule,
  OwnScheduleDocumentOverride
>;
