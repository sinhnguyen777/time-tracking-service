import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoleEnum } from '../common/constants/request';

@Schema({ timestamps: true, collection: 'permissions' })
export class Permission extends Document {
  @Prop({ required: true })
  id: number;

  @Prop({ enum: Object.values(RoleEnum) })
  name: RoleEnum;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
