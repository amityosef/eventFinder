import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

export enum UserRole {
  Admin = 'admin',
  Owner = 'owner',
  User = 'user',
}

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret: Record<string, unknown>) => {
      delete ret.password;
      delete ret.refreshTokens;
      delete ret.__v;
      return ret;
    },
  },
})
export class User {
  @ApiProperty({ description: 'User ID' })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'User email address' })
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: false, select: false })
  password?: string;

  @ApiProperty({ description: 'User full name' })
  @Prop({ required: true, trim: true })
  fullName: string;

  @ApiProperty({ description: 'User avatar URL' })
  @Prop({ default: null })
  avatar?: string;

  @ApiProperty({ description: 'Google OAuth ID' })
  @Prop({ default: null })
  googleId?: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  @Prop({ type: String, enum: UserRole, default: UserRole.User })
  role: UserRole;

  @ApiProperty({ description: 'Phone number' })
  @Prop({ default: null })
  phone?: string;

  @Prop({ type: [String], default: [], select: false })
  refreshTokens: string[];

  @ApiProperty({ description: 'Whether the user is active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Last login timestamp' })
  @Prop({ default: null })
  lastLogin?: Date;

  @ApiProperty({ description: 'Account creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Account last update date' })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 });
UserSchema.index({ role: 1 });
