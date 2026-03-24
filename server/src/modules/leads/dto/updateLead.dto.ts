import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { LeadStatus } from '../schemas/lead.schema';

export class UpdateLeadDto {
  @ApiPropertyOptional({ description: 'Lead status', enum: LeadStatus })
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @ApiPropertyOptional({ description: 'Internal notes' })
  @IsString()
  @IsOptional()
  internalNotes?: string;
}
