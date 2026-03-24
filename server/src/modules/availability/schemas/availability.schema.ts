import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type AvailabilityDocument = Availability & Document;

export enum TimeSlot {
  Morning = 'morning',
  Evening = 'evening',
  FullDay = 'fullDay',
}

export enum AvailabilityStatus {
  Available = 'available',
  Booked = 'booked',
  Hold = 'hold',
}

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
})
export class Availability {
  @ApiProperty({ description: 'Availability ID' })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'Venue ID' })
  @Prop({ type: Types.ObjectId, ref: 'Venue', required: true })
  venueId: Types.ObjectId;

  @ApiProperty({ description: 'Date' })
  @Prop({ required: true, type: Date })
  date: Date;

  @ApiProperty({ description: 'Is available' })
  @Prop({ default: true })
  isAvailable: boolean;

  @ApiProperty({ description: 'Availability status', enum: AvailabilityStatus })
  @Prop({
    type: String,
    enum: AvailabilityStatus,
    default: AvailabilityStatus.Available,
  })
  status: AvailabilityStatus;

  @ApiProperty({ description: 'Time slot', enum: TimeSlot })
  @Prop({ type: String, enum: TimeSlot, required: true })
  slot: TimeSlot;

  @ApiProperty({ description: 'Special price for this date (optional)' })
  @Prop()
  specialPrice?: number;

  @ApiProperty({ description: 'Notes about this date' })
  @Prop()
  notes?: string;

  @ApiProperty({ description: 'Booking reference if booked' })
  @Prop({ type: Types.ObjectId, ref: 'Lead' })
  bookingRef?: Types.ObjectId;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}

export const AvailabilitySchema = SchemaFactory.createForClass(Availability);

// Indexes for quick lookup
AvailabilitySchema.index({ venueId: 1, date: 1, slot: 1 }, { unique: true });
AvailabilitySchema.index({ venueId: 1, date: 1 });
AvailabilitySchema.index({ date: 1 });
AvailabilitySchema.index({ isAvailable: 1 });
