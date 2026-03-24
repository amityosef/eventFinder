import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { LeadStatus } from '../schemas/lead.schema';

export class UpdateLeadStatusDto {
    @ApiProperty({ description: 'Lead status', enum: LeadStatus })
    @IsEnum(LeadStatus)
    status: LeadStatus;
}
