import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
@Schema({ _id: false })
export class Block {
  @Prop({
    trim: true,
    uppercase: true,
  })
  hall?: string;

  @Prop({
    trim: true,
    uppercase: true,
  })
  classroom?: string;

  @Prop({
    required: true,
    enum: [
      'LUNES',
      'MARTES',
      'MIÉRCOLES',
      'JUEVES',
      'VIERNES',
      'SÁBADO',
      'DOMINGO',
    ],
    uppercase: true,
  })
  day: string;

  @Prop({
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
  })
  start: string;

  @Prop({
    required: true,
    match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
  })
  end: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  })
  teacher: Types.ObjectId;
}

export const BlockSchema = SchemaFactory.createForClass(Block);
