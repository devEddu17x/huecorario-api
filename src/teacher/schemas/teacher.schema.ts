import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TeacherDocument = HydratedDocument<Teacher>;

@Schema({
  timestamps: true,
  collection: 'teachers',
})
export class Teacher {
  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  id: string;

  @Prop({
    required: true,
    trim: true,
  })
  name: string;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
