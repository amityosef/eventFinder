import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsEmail } from 'class-validator';
import { EventType } from '../schemas/lead.schema';

export class CreateLeadDto {
  @ApiProperty({ description: 'Venue ID' })
  @IsString()
  venueId: string;

  @ApiProperty({ description: 'Customer full name', example: 'דוד כהן' })
  @IsString()
  customerName: string;

  @ApiProperty({ description: 'Customer email', example: 'david@example.com' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ description: 'Customer phone', example: '052-1234567' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Event date', example: '2026-06-15' })
  @IsString()
  eventDate: string;

  @ApiProperty({ description: 'Number of guests', example: 200 })
  @IsNumber()
  guestsCount: number;

  @ApiPropertyOptional({ description: 'Event type', enum: EventType })
  @IsEnum(EventType)
  @IsOptional()
  eventType?: EventType;

  @ApiPropertyOptional({ description: 'Additional message' })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiPropertyOptional({ description: 'Budget range', example: '30,000-50,000' })
  @IsString()
  @IsOptional()
  budget?: string;

  @ApiPropertyOptional({ description: 'Preferred time slot', example: 'evening' })
  @IsString()
  @IsOptional()
  preferredSlot?: string;
}
