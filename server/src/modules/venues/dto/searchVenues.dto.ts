import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsEnum,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { VenueType } from '../schemas/venue.schema';

export class SearchVenuesDto {
  @ApiPropertyOptional({ description: 'Page number', example: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', example: 12 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number;

  @ApiPropertyOptional({ description: 'Search text' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'City filter', example: 'תל אביב' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ description: 'Region filter', example: 'מרכז' })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiPropertyOptional({ description: 'Minimum capacity', example: 100 })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  minCapacity?: number;

  @ApiPropertyOptional({ description: 'Maximum capacity', example: 500 })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  maxCapacity?: number;

  @ApiPropertyOptional({ description: 'Minimum price', example: 100 })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price', example: 500 })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Venue types', type: [String], enum: VenueType })
  @IsArray()
  @IsEnum(VenueType, { each: true })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  types?: VenueType[];

  @ApiPropertyOptional({ description: 'Kosher filter' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  kosher?: boolean;

  @ApiPropertyOptional({ description: 'Accessibility filter' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  accessibility?: boolean;

  @ApiPropertyOptional({ description: 'Parking filter' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  parking?: boolean;

  @ApiPropertyOptional({ description: 'Start date filter', example: '2026-02-01' })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date filter', example: '2026-02-28' })
  @IsString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Sort by field', example: 'price.amount' })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'] })
  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc';
}
