import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'roles' })
export class Role extends Document {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  id_permission: number;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
