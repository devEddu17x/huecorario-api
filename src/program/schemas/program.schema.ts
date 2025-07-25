import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProgramDocument = HydratedDocument<Program>;
@Schema({ timestamps: true })
export class Program {
  @Prop({ required: true, trim: true, uppercase: true })
  name: string;
}

export const ProgramSchema = SchemaFactory.createForClass(Program);
