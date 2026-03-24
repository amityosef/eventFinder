import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsEnum,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VenueType, PriceType } from '../schemas/venue.schema';

class CoordinatesDto {
  @ApiProperty({ description: 'Longitude', example: 34.7818 })
  @IsNumber()
  lng: number;

  @ApiProperty({ description: 'Latitude', example: 32.0853 })
  @IsNumber()
  lat: number;
}

class LocationDto {
  @ApiProperty({ description: 'City', example: 'תל אביב' })
  @IsString()
  city: string;

  @ApiPropertyOptional({ description: 'Neighborhood', example: 'רמת אביב' })
  @IsString()
  @IsOptional()
  neighborhood?: string;

  @ApiProperty({ description: 'Region', example: 'מרכז' })
  @IsString()
  region: string;

  @ApiProperty({ description: 'Full address', example: 'רחוב הירקון 123' })
  @IsString()
  address: string;

  @ApiPropertyOptional({ description: 'Coordinates' })
  @ValidateNested()
  @Type(() => CoordinatesDto)
  @IsOptional()
  coordinates?: CoordinatesDto;
}

class CapacityDto {
  @ApiProperty({ description: 'Minimum guests', example: 50 })
  @IsNumber()
  @Min(1)
  min: number;

  @ApiProperty({ description: 'Maximum guests', example: 500 })
  @IsNumber()
  @Min(1)
  max: number;
}

class PriceDto {
  @ApiProperty({ description: 'Price amount', example: 150 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ description: 'Price type', enum: PriceType, example: PriceType.PerPerson })
  @IsEnum(PriceType)
  type: PriceType;

  @ApiPropertyOptional({ description: 'Currency', example: 'ILS' })
  @IsString()
  @IsOptional()
  currency?: string;
}

class FeaturesDto {
  @ApiPropertyOptional({ description: 'Is kosher certified', example: true })
  @IsBoolean()
  @IsOptional()
  kosher?: boolean;

  @ApiPropertyOptional({ description: 'Has wheelchair accessibility', example: true })
  @IsBoolean()
  @IsOptional()
  accessibility?: boolean;

  @ApiPropertyOptional({ description: 'Has parking', example: true })
  @IsBoolean()
  @IsOptional()
  parking?: boolean;

  @ApiPropertyOptional({ description: 'Has accommodation', example: false })
  @IsBoolean()
  @IsOptional()
  accommodation?: boolean;

  @ApiPropertyOptional({ description: 'Has outdoor area', example: true })
  @IsBoolean()
  @IsOptional()
  outdoorArea?: boolean;

  @ApiPropertyOptional({ description: 'Has indoor area', example: true })
  @IsBoolean()
  @IsOptional()
  indoorArea?: boolean;

  @ApiPropertyOptional({ description: 'Has DJ equipment', example: false })
  @IsBoolean()
  @IsOptional()
  djEquipment?: boolean;

  @ApiPropertyOptional({ description: 'Has catering', example: true })
  @IsBoolean()
  @IsOptional()
  catering?: boolean;

  @ApiPropertyOptional({ description: 'Venue types', type: [String], enum: VenueType })
  @IsArray()
  @IsEnum(VenueType, { each: true })
  @IsOptional()
  types?: VenueType[];
}

export class CreateVenueDto {
  @ApiProperty({ description: 'Venue name', example: 'היכל האירועים הגדול' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Venue description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Location details' })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiProperty({ description: 'Capacity details' })
  @ValidateNested()
  @Type(() => CapacityDto)
  capacity: CapacityDto;

  @ApiProperty({ description: 'Price details' })
  @ValidateNested()
  @Type(() => PriceDto)
  price: PriceDto;

  @ApiPropertyOptional({ description: 'Features' })
  @ValidateNested()
  @Type(() => FeaturesDto)
  @IsOptional()
  features?: FeaturesDto;

  @ApiPropertyOptional({ description: 'Gallery image paths', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  gallery?: string[];

  @ApiPropertyOptional({ description: 'Main image path' })
  @IsString()
  @IsOptional()
  mainImage?: string;

  @ApiPropertyOptional({ description: 'Contact email' })
  @IsString()
  @IsOptional()
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Contact phone' })
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiPropertyOptional({ description: 'Website URL' })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({ description: 'Is venue active' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Is venue featured' })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
