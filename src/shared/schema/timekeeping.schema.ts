import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as uuid from 'uuid';

export type TimekeepingDocument = Timekeeping & Document;

@Schema({ timestamps: true, collection: 'timekeeping' })
export class Timekeeping {
  @Prop({ type: String, default: () => uuid.v4() })
  id: string;

  @Prop({ required: true })
  user_id: number; // ID employee

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  time_check_in: Date;

  @Prop({ required: false })
  time_check_out: Date;

  @Prop({ default: 'working' })
  status: string;

  @Prop({ default: 0 })
  late_minutes: number;
}

export const TimekeepingSchema = SchemaFactory.createForClass(Timekeeping);
