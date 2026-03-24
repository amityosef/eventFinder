import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type LeadDocument = Lead & Document;

export enum LeadStatus {
  New = 'new',
  Contacted = 'contacted',
  Negotiating = 'negotiating',
  Confirmed = 'confirmed',
  Cancelled = 'cancelled',
  Completed = 'completed',
}

export enum EventType {
  Wedding = 'wedding',
  BarMitzvah = 'barMitzvah',
  BatMitzvah = 'batMitzvah',
  Birthday = 'birthday',
  Corporate = 'corporate',
  Engagement = 'engagement',
  Anniversary = 'anniversary',
  Other = 'other',
}

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
})
export class Lead {
  @ApiProperty({ description: 'Lead ID' })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'Venue ID' })
  @Prop({ type: Types.ObjectId, ref: 'Venue', required: true })
  venueId: Types.ObjectId;

  @ApiProperty({ description: 'Customer full name' })
  @Prop({ required: true, trim: true })
  customerName: string;

  @ApiProperty({ description: 'Customer email' })
  @Prop({ required: true, lowercase: true, trim: true })
  customerEmail: string;

  @ApiProperty({ description: 'Customer phone' })
  @Prop({ required: true })
  phone: string;

  @ApiProperty({ description: 'Event date' })
  @Prop({ required: true, type: Date })
  eventDate: Date;

  @ApiProperty({ description: 'Number of guests' })
  @Prop({ required: true })
  guestsCount: number;

  @ApiProperty({ description: 'Event type', enum: EventType })
  @Prop({ type: String, enum: EventType, default: EventType.Other })
  eventType: EventType;

  @ApiProperty({ description: 'Lead status', enum: LeadStatus })
  @Prop({ type: String, enum: LeadStatus, default: LeadStatus.New })
  status: LeadStatus;

  @ApiProperty({ description: 'Additional message from customer' })
  @Prop()
  message?: string;

  @ApiProperty({ description: 'Budget range' })
  @Prop()
  budget?: string;

  @ApiProperty({ description: 'Preferred time slot' })
  @Prop()
  preferredSlot?: string;

  @ApiProperty({ description: 'Internal notes (owner only)' })
  @Prop()
  internalNotes?: string;

  @ApiProperty({ description: 'User ID if logged in' })
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  @ApiProperty({ description: 'Last contact date' })
  @Prop()
  lastContactDate?: Date;

  @ApiProperty({ description: 'Email notification sent' })
  @Prop({ default: false })
  emailSent: boolean;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);

// Indexes
LeadSchema.index({ venueId: 1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ eventDate: 1 });
LeadSchema.index({ customerEmail: 1 });
LeadSchema.index({ createdAt: -1 });
