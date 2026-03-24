import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsDateString,
    IsEnum,
    IsString,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TimeSlot } from '../schemas/availability.schema';

class BulkAvailabilityEntryDto {
    @ApiProperty({ description: 'Date', example: '2026-02-14' })
    @IsDateString()
    date: string;

    @ApiProperty({ description: 'Time slot', enum: TimeSlot })
    @IsEnum(TimeSlot)
    slot: TimeSlot;

    @ApiProperty({ description: 'Is available', example: true })
    @IsBoolean()
    isAvailable: boolean;
}

export class BulkAvailabilityDto {
    @ApiProperty({ description: 'Venue ID' })
    @IsString()
    venueId: string;

    @ApiProperty({ type: [BulkAvailabilityEntryDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BulkAvailabilityEntryDto)
    entries: BulkAvailabilityEntryDto[];
}
