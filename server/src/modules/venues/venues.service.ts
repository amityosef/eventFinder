import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, FilterQuery } from 'mongoose';
import { Venue, VenueDocument, VenueType } from './schemas/venue.schema';
import { CreateVenueDto } from './dto/createVenue.dto';
import { UpdateVenueDto } from './dto/updateVenue.dto';
import { SearchVenuesDto } from './dto/searchVenues.dto';

@Injectable()
export class VenuesService {
  constructor(
    @InjectModel(Venue.name) private venueModel: Model<VenueDocument>,
  ) { }

  async create(createVenueDto: CreateVenueDto, ownerId: string): Promise<VenueDocument> {
    const venue = new this.venueModel({
      ...createVenueDto,
      owner: new Types.ObjectId(ownerId),
    });
    return venue.save();
  }

  async findAll(query: SearchVenuesDto): Promise<{
    venues: VenueDocument[];
    total: number;
    pages: number;
    currentPage: number;
  }> {
    const {
      page = 1,
      limit = 12,
      search,
      city,
      region,
      minCapacity,
      maxCapacity,
      minPrice,
      maxPrice,
      types,
      kosher,
      accessibility,
      parking,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;
    const filter: FilterQuery<VenueDocument> = { isActive: true };

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Location filters
    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }
    if (region) {
      filter['location.region'] = { $regex: region, $options: 'i' };
    }

    // Capacity filters
    if (minCapacity) {
      filter['capacity.max'] = { $gte: minCapacity };
    }
    if (maxCapacity) {
      filter['capacity.min'] = { $lte: maxCapacity };
    }

    // Price filters
    if (minPrice !== undefined) {
      filter['price.amount'] = { ...filter['price.amount'], $gte: minPrice };
    }
    if (maxPrice !== undefined) {
      filter['price.amount'] = { ...filter['price.amount'], $lte: maxPrice };
    }

    // Feature filters
    if (types && types.length > 0) {
      filter['features.types'] = { $in: types };
    }
    if (kosher !== undefined) {
      filter['features.kosher'] = kosher;
    }
    if (accessibility !== undefined) {
      filter['features.accessibility'] = accessibility;
    }
    if (parking !== undefined) {
      filter['features.parking'] = parking;
    }

    // Sorting
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [venues, total] = await Promise.all([
      this.venueModel
        .find(filter)
        .populate('owner', 'fullName email avatar')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.venueModel.countDocuments(filter),
    ]);

    return {
      venues,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async findById(id: string): Promise<VenueDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid venue ID');
    }

    const venue = await this.venueModel
      .findById(id)
      .populate('owner', 'fullName email avatar phone');

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    return venue;
  }

  async findByOwner(ownerId: string): Promise<VenueDocument[]> {
    return this.venueModel
      .find({ owner: new Types.ObjectId(ownerId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findFeatured(limit = 8): Promise<VenueDocument[]> {
    return this.venueModel
      .find({ isActive: true, isFeatured: true })
      .sort({ rating: -1 })
      .limit(limit)
      .exec();
  }

  async update(
    id: string,
    updateVenueDto: UpdateVenueDto,
    userId: string,
    isAdmin: boolean,
  ): Promise<VenueDocument> {
    const venue = await this.findById(id);

    if (!isAdmin && venue.owner.toString() !== userId) {
      throw new ForbiddenException('You are not allowed to update this venue');
    }

    Object.assign(venue, updateVenueDto);
    return venue.save();
  }

  async delete(id: string, userId: string, isAdmin: boolean): Promise<void> {
    const venue = await this.findById(id);

    if (!isAdmin && venue.owner.toString() !== userId) {
      throw new ForbiddenException('You are not allowed to delete this venue');
    }

    await this.venueModel.findByIdAndDelete(id);
  }

  async updateGallery(
    id: string,
    imagePaths: string[],
    userId: string,
    isAdmin: boolean,
  ): Promise<VenueDocument> {
    const venue = await this.findById(id);

    if (!isAdmin && venue.owner.toString() !== userId) {
      throw new ForbiddenException('You are not allowed to update this venue');
    }

    venue.gallery = [...venue.gallery, ...imagePaths];
    if (!venue.mainImage && imagePaths.length > 0) {
      venue.mainImage = imagePaths[0];
    }

    return venue.save();
  }

  async removeGalleryImage(
    id: string,
    imagePath: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<VenueDocument> {
    const venue = await this.findById(id);

    if (!isAdmin && venue.owner.toString() !== userId) {
      throw new ForbiddenException('You are not allowed to update this venue');
    }

    venue.gallery = venue.gallery.filter((img) => img !== imagePath);
    if (venue.mainImage === imagePath) {
      venue.mainImage = venue.gallery[0] || undefined;
    }

    return venue.save();
  }

  async setMainImage(
    id: string,
    imagePath: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<VenueDocument> {
    const venue = await this.findById(id);

    if (!isAdmin && venue.owner.toString() !== userId) {
      throw new ForbiddenException('You are not allowed to update this venue');
    }

    venue.mainImage = imagePath;
    return venue.save();
  }

  async searchByFilters(filters: Record<string, unknown>): Promise<VenueDocument[]> {
    // Used by AI search
    const query: FilterQuery<VenueDocument> = { isActive: true };

    if (filters.city) {
      query['location.city'] = { $regex: filters.city as string, $options: 'i' };
    }
    if (filters.region) {
      query['location.region'] = { $regex: filters.region as string, $options: 'i' };
    }
    if (filters.minCapacity) {
      query['capacity.max'] = { $gte: filters.minCapacity as number };
    }
    if (filters.maxCapacity) {
      query['capacity.min'] = { $lte: filters.maxCapacity as number };
    }
    if (filters.maxPrice) {
      query['price.amount'] = { $lte: filters.maxPrice as number };
    }
    if (filters.minPrice) {
      query['price.amount'] = { ...query['price.amount'], $gte: filters.minPrice as number };
    }
    if (filters.kosher !== undefined) {
      query['features.kosher'] = filters.kosher;
    }
    if (filters.accessibility !== undefined) {
      query['features.accessibility'] = filters.accessibility;
    }
    if (filters.types && Array.isArray(filters.types)) {
      query['features.types'] = { $in: filters.types };
    }

    return this.venueModel
      .find(query)
      .populate('owner', 'fullName email')
      .limit(20)
      .exec();
  }

  async getStats(): Promise<{
    totalVenues: number;
    activeVenues: number;
    featuredVenues: number;
    venuesByType: Record<string, number>;
    venuesByCity: Record<string, number>;
  }> {
    const [
      totalVenues,
      activeVenues,
      featuredVenues,
      typeAggregation,
      cityAggregation,
    ] = await Promise.all([
      this.venueModel.countDocuments(),
      this.venueModel.countDocuments({ isActive: true }),
      this.venueModel.countDocuments({ isFeatured: true }),
      this.venueModel.aggregate([
        { $unwind: '$features.types' },
        { $group: { _id: '$features.types', count: { $sum: 1 } } },
      ]),
      this.venueModel.aggregate([
        { $group: { _id: '$location.city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    const venuesByType: Record<string, number> = {};
    typeAggregation.forEach((item: { _id: string; count: number }) => {
      venuesByType[item._id] = item.count;
    });

    const venuesByCity: Record<string, number> = {};
    cityAggregation.forEach((item: { _id: string; count: number }) => {
      venuesByCity[item._id] = item.count;
    });

    return {
      totalVenues,
      activeVenues,
      featuredVenues,
      venuesByType,
      venuesByCity,
    };
  }
}
