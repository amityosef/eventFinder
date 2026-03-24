import { PartialType } from '@nestjs/swagger';
import { CreateVenueDto } from './createVenue.dto';

export class UpdateVenueDto extends PartialType(CreateVenueDto) { }
