import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'permissions' })
export class Permission extends Document {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
