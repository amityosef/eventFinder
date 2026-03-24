import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type VenueDocument = Venue & Document;

export enum VenueType {
  Hall = 'hall',
  Garden = 'garden',
  Beach = 'beach',
  Restaurant = 'restaurant',
  Rooftop = 'rooftop',
  Villa = 'villa',
  Hotel = 'hotel',
  Other = 'other',
}

export enum PriceType {
  PerPerson = 'perPerson',
  Fixed = 'fixed',
  Hourly = 'hourly',
}

export class Location {
  @ApiProperty({ description: 'City name' })
  @Prop({ required: true })
  city: string;

  @ApiProperty({ description: 'Neighborhood' })
  @Prop()
  neighborhood?: string;

  @ApiProperty({ description: 'Region' })
  @Prop({ required: true })
  region: string;

  @ApiProperty({ description: 'Full address' })
  @Prop({ required: true })
  address: string;

  @ApiProperty({ description: 'Coordinates [lng, lat]' })
  @Prop({ type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: [Number] })
  coordinates: {
    type: string;
    coordinates: [number, number];
  };
}

export class Capacity {
  @ApiProperty({ description: 'Minimum guests' })
  @Prop({ required: true })
  min: number;

  @ApiProperty({ description: 'Maximum guests' })
  @Prop({ required: true })
  max: number;
}

export class Price {
  @ApiProperty({ description: 'Price amount' })
  @Prop({ required: true })
  amount: number;

  @ApiProperty({ description: 'Price type', enum: PriceType })
  @Prop({ type: String, enum: PriceType, default: PriceType.PerPerson })
  type: PriceType;

  @ApiProperty({ description: 'Currency' })
  @Prop({ default: 'ILS' })
  currency: string;
}

export class Features {
  @ApiProperty({ description: 'Is kosher certified' })
  @Prop({ default: false })
  kosher: boolean;

  @ApiProperty({ description: 'Has wheelchair accessibility' })
  @Prop({ default: false })
  accessibility: boolean;

  @ApiProperty({ description: 'Has parking' })
  @Prop({ default: false })
  parking: boolean;

  @ApiProperty({ description: 'Has accommodation' })
  @Prop({ default: false })
  accommodation: boolean;

  @ApiProperty({ description: 'Has outdoor area' })
  @Prop({ default: false })
  outdoorArea: boolean;

  @ApiProperty({ description: 'Has indoor area' })
  @Prop({ default: true })
  indoorArea: boolean;

  @ApiProperty({ description: 'Has DJ equipment' })
  @Prop({ default: false })
  djEquipment: boolean;

  @ApiProperty({ description: 'Has catering' })
  @Prop({ default: false })
  catering: boolean;

  @ApiProperty({ description: 'Venue types', type: [String], enum: VenueType })
  @Prop({ type: [String], enum: VenueType, default: [] })
  types: VenueType[];
}

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
})
export class Venue {
  @ApiProperty({ description: 'Venue ID' })
  _id: Types.ObjectId;

  @ApiProperty({ description: 'Venue name' })
  @Prop({ required: true, trim: true, index: true })
  name: string;

  @ApiProperty({ description: 'Venue description' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ description: 'Location details' })
  @Prop({ type: Location, required: true })
  location: Location;

  @ApiProperty({ description: 'Capacity details' })
  @Prop({ type: Capacity, required: true })
  capacity: Capacity;

  @ApiProperty({ description: 'Price details' })
  @Prop({ type: Price, required: true })
  price: Price;

  @ApiProperty({ description: 'Features' })
  @Prop({ type: Features, default: {} })
  features: Features;

  @ApiProperty({ description: 'Gallery image paths' })
  @Prop({ type: [String], default: [] })
  gallery: string[];

  @ApiProperty({ description: 'Main image path' })
  @Prop()
  mainImage?: string;

  @ApiProperty({ description: 'Owner user ID' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @ApiProperty({ description: 'Average rating' })
  @Prop({ default: 0, min: 0, max: 5 })
  rating: number;

  @ApiProperty({ description: 'Number of reviews' })
  @Prop({ default: 0 })
  reviewCount: number;

  @ApiProperty({ description: 'Is venue active' })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Is venue featured' })
  @Prop({ default: false })
  isFeatured: boolean;

  @ApiProperty({ description: 'Contact email' })
  @Prop()
  contactEmail?: string;

  @ApiProperty({ description: 'Contact phone' })
  @Prop()
  contactPhone?: string;

  @ApiProperty({ description: 'Website URL' })
  @Prop()
  website?: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}

export const VenueSchema = SchemaFactory.createForClass(Venue);

// Indexes
VenueSchema.index({ name: 'text', description: 'text' });
VenueSchema.index({ 'location.city': 1 });
VenueSchema.index({ 'location.region': 1 });
VenueSchema.index({ 'location.coordinates': '2dsphere' });
VenueSchema.index({ 'price.amount': 1 });
VenueSchema.index({ 'capacity.max': 1 });
VenueSchema.index({ 'features.types': 1 });
VenueSchema.index({ owner: 1 });
VenueSchema.index({ isActive: 1 });
VenueSchema.index({ isFeatured: 1 });
