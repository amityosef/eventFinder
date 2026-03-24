import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { AvailabilityStatus, TimeSlot } from '../schemas/availability.schema';

export class CreateAvailabilityDto {
  @ApiProperty({ description: 'Venue ID' })
  @IsString()
  venueId: string;

  @ApiProperty({ description: 'Date', example: '2026-02-14' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Is available', example: true })
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({ description: 'Time slot', enum: TimeSlot })
  @IsEnum(TimeSlot)
  slot: TimeSlot;

  @ApiPropertyOptional({ description: 'Special price for this date' })
  @IsNumber()
  @IsOptional()
  specialPrice?: number;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Availability status', enum: AvailabilityStatus })
  @IsEnum(AvailabilityStatus)
  @IsOptional()
  status?: AvailabilityStatus;
}
