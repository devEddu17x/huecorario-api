import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Campus } from 'src/common/enums/campus.enum';
import { Program } from 'src/program/schemas/program.schema';

export type StudentDocument = HydratedDocument<Student>;

@Schema({ timestamps: true })
export class Student {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  lastname: string;
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;
  @Prop({ required: true, length: 60 }) // bcrypt hashes are typically 60 characters long
  password: string;
  @Prop({ trim: true, match: /^[0-9]{9}$/ })
  phone: string;
  @Prop({ enum: Campus })
  campus: Campus;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Program',
    required: true,
  })
  program: Types.ObjectId;
  @Prop({ type: Number, min: 1, max: 20, name: 'current_cycle' })
  currentCycle: number;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

StudentSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});
