import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/createAvailability.dto';
import { UpdateAvailabilityDto } from './dto/updateAvailability.dto';
import { BulkAvailabilityDto } from './dto/bulkAvailability.dto';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { TimeSlot } from './schemas/availability.schema';

@ApiTags('availability')
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) { }

  @Get('venue/:venueId')
  @ApiOperation({ summary: 'Get availability for a venue' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiResponse({ status: 200, description: 'Availability list' })
  async getByVenue(
    @Param('venueId') venueId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.availabilityService.findByVenue(
      venueId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('venue/:venueId/month')
  @ApiOperation({ summary: 'Get monthly availability for a venue' })
  @ApiQuery({ name: 'year', required: true })
  @ApiQuery({ name: 'month', required: true })
  @ApiResponse({ status: 200, description: 'Monthly availability' })
  async getMonthAvailability(
    @Param('venueId') venueId: string,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.availabilityService.getMonthAvailability(venueId, year, month);
  }

  @Get('venue/:venueId/check')
  @ApiOperation({ summary: 'Check specific date availability' })
  @ApiQuery({ name: 'date', required: true })
  @ApiQuery({ name: 'slot', required: true, enum: TimeSlot })
  @ApiResponse({ status: 200, description: 'Availability status' })
  async checkAvailability(
    @Param('venueId') venueId: string,
    @Query('date') date: string,
    @Query('slot') slot: TimeSlot,
  ) {
    const isAvailable = await this.availabilityService.checkAvailability(
      venueId,
      new Date(date),
      slot,
    );
    return { isAvailable };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create availability entry' })
  @ApiResponse({ status: 201, description: 'Availability created' })
  async create(@Body() createDto: CreateAvailabilityDto) {
    return this.availabilityService.create(createDto);
  }

  @Post('bulk')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Bulk create/update availability' })
  @ApiResponse({ status: 201, description: 'Availability entries created' })
  async bulkCreate(
    @Body() body: BulkAvailabilityDto,
  ) {
    const entries = body.entries.map((e) => ({
      ...e,
      date: new Date(e.date),
    }));
    return this.availabilityService.bulkCreate(body.venueId, entries);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update availability entry' })
  @ApiResponse({ status: 200, description: 'Availability updated' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAvailabilityDto,
  ) {
    return this.availabilityService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete availability entry' })
  @ApiResponse({ status: 200, description: 'Availability deleted' })
  async delete(@Param('id') id: string) {
    await this.availabilityService.delete(id);
    return { message: 'Availability deleted successfully' };
  }
}
