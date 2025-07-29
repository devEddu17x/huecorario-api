import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type ProgramDocument = HydratedDocument<Program>;

@Schema()
export class Program {
  @Prop({
    required: true,
    enum: ['CAMPUS PRINCIPAL TRUJILLO', 'CAMPUS PIURA'],
    index: true,
  })
  campus: string;

  @Prop({
    required: true,
    trim: true,
    uppercase: true,
  })
  code: string;

  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
  ])
  courses: Types.ObjectId[];
}

export const ProgramSchema = SchemaFactory.createForClass(Program);

ProgramSchema.set('timestamps', true);
ProgramSchema.set('collection', 'programs');

ProgramSchema.index({ campus: 1, code: 1 }, { unique: true });
