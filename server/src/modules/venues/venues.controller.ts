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
import { VenuesService } from './venues.service';
import { CreateVenueDto } from './dto/createVenue.dto';
import { UpdateVenueDto } from './dto/updateVenue.dto';
import { SearchVenuesDto } from './dto/searchVenues.dto';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

interface AuthenticatedRequest {
  user: {
    userId: string;
  };
}

interface RoleAwareRequest extends AuthenticatedRequest {
  user: {
    userId: string;
    role: string;
  };
}

@ApiTags('venues')
@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) { }

  private isAdmin(role: string): boolean {
    return role === UserRole.Admin;
  }

  @Get()
  @ApiOperation({ summary: 'Get all venues with filters' })
  @ApiResponse({ status: 200, description: 'List of venues' })
  async findAll(@Query() query: SearchVenuesDto) {
    return this.venuesService.findAll(query);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured venues' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Featured venues' })
  async getFeatured(@Query('limit') limit?: number) {
    return this.venuesService.findFeatured(limit);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get venue statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Venue statistics' })
  async getStats() {
    return this.venuesService.getStats();
  }

  @Get('my-venues')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user venues' })
  @ApiResponse({ status: 200, description: 'User venues' })
  async getMyVenues(@Request() req: AuthenticatedRequest) {
    return this.venuesService.findByOwner(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get venue by ID' })
  @ApiResponse({ status: 200, description: 'Venue details' })
  @ApiResponse({ status: 404, description: 'Venue not found' })
  async findOne(@Param('id') id: string) {
    return this.venuesService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.Owner)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create new venue (Owner/Admin only)' })
  @ApiResponse({ status: 201, description: 'Venue created' })
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() createVenueDto: CreateVenueDto,
  ) {
    return this.venuesService.create(createVenueDto, req.user.userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update venue' })
  @ApiResponse({ status: 200, description: 'Venue updated' })
  async update(
    @Param('id') id: string,
    @Request() req: RoleAwareRequest,
    @Body() updateVenueDto: UpdateVenueDto,
  ) {
    const isAdmin = this.isAdmin(req.user.role);
    return this.venuesService.update(id, updateVenueDto, req.user.userId, isAdmin);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete venue' })
  @ApiResponse({ status: 200, description: 'Venue deleted' })
  async delete(
    @Param('id') id: string,
    @Request() req: RoleAwareRequest,
  ) {
    const isAdmin = this.isAdmin(req.user.role);
    await this.venuesService.delete(id, req.user.userId, isAdmin);
    return { message: 'Venue deleted successfully' };
  }

  @Put(':id/gallery')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Add images to venue gallery' })
  @ApiResponse({ status: 200, description: 'Gallery updated' })
  async updateGallery(
    @Param('id') id: string,
    @Request() req: RoleAwareRequest,
    @Body() body: { images: string[] },
  ) {
    const isAdmin = this.isAdmin(req.user.role);
    return this.venuesService.updateGallery(id, body.images, req.user.userId, isAdmin);
  }

  @Delete(':id/gallery')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove image from venue gallery' })
  @ApiResponse({ status: 200, description: 'Image removed' })
  async removeGalleryImage(
    @Param('id') id: string,
    @Request() req: RoleAwareRequest,
    @Body() body: { imagePath: string },
  ) {
    const isAdmin = this.isAdmin(req.user.role);
    return this.venuesService.removeGalleryImage(
      id,
      body.imagePath,
      req.user.userId,
      isAdmin,
    );
  }

  @Put(':id/main-image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Set main image for venue' })
  @ApiResponse({ status: 200, description: 'Main image updated' })
  async setMainImage(
    @Param('id') id: string,
    @Request() req: RoleAwareRequest,
    @Body() body: { imagePath: string },
  ) {
    const isAdmin = this.isAdmin(req.user.role);
    return this.venuesService.setMainImage(
      id,
      body.imagePath,
      req.user.userId,
      isAdmin,
    );
  }
}
