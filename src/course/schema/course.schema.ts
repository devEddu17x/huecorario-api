import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({
  timestamps: true,
  collection: 'courses',
})
export class Course {
  @Prop({
    required: true,
    trim: true,
    uppercase: true,
    index: true,
  })
  codeNumber: string;

  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
    uppercase: true,
  })
  code: string;

  @Prop({
    required: true,
    enum: [
      'PRESENCIAL - ( PRS )',
      'NO PRESENCIAL - ( NPR )',
      'NO ESPECIFICADO',
    ],
  })
  type: string;

  @Prop({
    required: true,
    enum: ['CAMPUS PRINCIPAL TRUJILLO', 'CAMPUS PIURA'],
    index: true,
  })
  campus: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true,
    index: true,
  })
  program: Types.ObjectId;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Schedule',
    },
  ])
  schedules: Types.ObjectId[];

  @Prop({
    required: true,
    default: true,
  })
  hasSchedules: boolean;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

// Índice compuesto para codeNumber + campus + programa (debería ser único)
CourseSchema.index({ codeNumber: 1, campus: 1, program: 1 }, { unique: true });

// Validación personalizada para consistencia entre hasSchedules y schedules
CourseSchema.pre('save', function (next) {
  if (this.hasSchedules && this.schedules.length === 0) {
    const error = new Error(
      `Course ${this.codeNumber} is marked as hasSchedules=true but has empty schedules array`,
    );
    return next(error);
  }
  if (!this.hasSchedules && this.schedules.length > 0) {
    const error = new Error(
      `Course ${this.codeNumber} is marked as hasSchedules=false but has schedules in array`,
    );
    return next(error);
  }
  next();
});
