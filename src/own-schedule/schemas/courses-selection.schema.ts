import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: false })
export class CourseSelection {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course', required: true })
  course: Types.ObjectId;

  @Prop({ required: true, trim: true })
  courseName: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Schedule',
    required: true,
    minlength: 1,
    maxlength: 10,
  })
  schedules: Types.ObjectId[];
}

export const CourseSelectionSchema =
  SchemaFactory.createForClass(CourseSelection);
