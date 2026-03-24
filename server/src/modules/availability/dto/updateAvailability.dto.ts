import { PartialType } from '@nestjs/swagger';
import { CreateAvailabilityDto } from './createAvailability.dto';

export class UpdateAvailabilityDto extends PartialType(CreateAvailabilityDto) { }
