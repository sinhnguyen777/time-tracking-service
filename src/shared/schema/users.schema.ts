import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'employees' })
export class User {
  @Prop({ required: true, unique: true })
  id: number;

  @Prop({ required: true, unique: true, trim: true })
  code: string;

  @Prop({ required: true, trim: true })
  full_name: string;

  @Prop({
    required: true,
    match: [/^\d{10,11}$/, 'Invalid phone number format'],
  })
  phone: string;

  @Prop({ default: null })
  address: string;

  @Prop({ required: true })
  position: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email format'],
  })
  email: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  @Prop({ required: true })
  id_role: number;

  // @Prop({ required: true, default: Date.now })
  // created_at: Date;

  // @Prop({ required: true, default: Date.now })
  // updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
