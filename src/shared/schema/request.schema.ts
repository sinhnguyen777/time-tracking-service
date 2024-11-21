import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'request' })
export class Request extends Document {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  code_request: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  time_start: Date;

  @Prop({ required: true })
  time_end: Date;

  @Prop({ required: true })
  status: string;

  @Prop()
  note: string;

  @Prop({ required: true })
  id_manager: number;

  @Prop({ required: true })
  id_employee: number;

  @Prop()
  id_related_person: number;

  @Prop({ required: true })
  id_request_type: number;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
