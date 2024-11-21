import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RequestStatusType } from '../common/constants/request';

@Schema({ timestamps: true, collection: 'request_type' })
export class RequestType extends Document {
  @Prop({ required: true })
  id: number;

  @Prop({ enum: Object.values(RequestStatusType) })
  name: RequestStatusType;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const RequestTypeSchema = SchemaFactory.createForClass(RequestType);
