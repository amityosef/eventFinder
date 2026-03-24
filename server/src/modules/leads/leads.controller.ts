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
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/createLead.dto';
import { UpdateLeadDto } from './dto/updateLead.dto';
import { UpdateLeadStatusDto } from './dto/updateLeadStatus.dto';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { LeadStatus } from './schemas/lead.schema';

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) { }

  @Post()
  @ApiOperation({ summary: 'Create new lead (inquiry)' })
  @ApiResponse({ status: 201, description: 'Lead created' })
  async create(
    @Body() createDto: CreateLeadDto,
    @Request() req?: { user?: { userId: string } },
  ) {
    return this.leadsService.create(createDto, req?.user?.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all leads (Admin only)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'venueId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: LeadStatus })
  @ApiResponse({ status: 200, description: 'List of leads' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('venueId') venueId?: string,
    @Query('status') status?: LeadStatus,
  ) {
    return this.leadsService.findAll({ page, limit, venueId, status });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get lead statistics' })
  @ApiQuery({ name: 'venueId', required: false })
  @ApiResponse({ status: 200, description: 'Lead statistics' })
  async getStats(@Query('venueId') venueId?: string) {
    return this.leadsService.getStats(venueId);
  }

  @Get('venue/:venueId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get leads for a venue' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false, enum: LeadStatus })
  @ApiResponse({ status: 200, description: 'Venue leads' })
  async findByVenue(
    @Param('venueId') venueId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: LeadStatus,
  ) {
    return this.leadsService.findByVenue(venueId, { page, limit, status });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get lead by ID' })
  @ApiResponse({ status: 200, description: 'Lead details' })
  async findOne(@Param('id') id: string) {
    return this.leadsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update lead' })
  @ApiResponse({ status: 200, description: 'Lead updated' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateDto);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update lead status' })
  @ApiResponse({ status: 200, description: 'Status updated' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateLeadStatusDto,
  ) {
    return this.leadsService.updateStatus(id, updateStatusDto.status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete lead (Admin only)' })
  @ApiResponse({ status: 200, description: 'Lead deleted' })
  async delete(@Param('id') id: string) {
    await this.leadsService.delete(id);
    return { message: 'Lead deleted successfully' };
  }
}
