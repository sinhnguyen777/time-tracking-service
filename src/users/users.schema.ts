import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['employee', 'manager', 'HR'], default: 'employee' })
  role: 'employee' | 'manager' | 'HR';
}

export const UserSchema = SchemaFactory.createForClass(User);
