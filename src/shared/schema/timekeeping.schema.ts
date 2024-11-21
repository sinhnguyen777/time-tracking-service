import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'timekeeping' })
export class Timekeeping extends Document {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  time_check_in: string;

  @Prop({ required: true })
  time_check_out: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  id_employee: number;
}

export const TimekeepingSchema = SchemaFactory.createForClass(Timekeeping);
