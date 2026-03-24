import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Lead, LeadDocument, LeadStatus } from './schemas/lead.schema';
import { CreateLeadDto } from './dto/createLead.dto';
import { UpdateLeadDto } from './dto/updateLead.dto';
import { MailService } from '../mail/mail.service';
import { VenuesService } from '../venues/venues.service';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
    private mailService: MailService,
    @Inject(forwardRef(() => VenuesService))
    private venuesService: VenuesService,
  ) { }

  async create(createDto: CreateLeadDto, userId?: string): Promise<LeadDocument> {
    const lead = new this.leadModel({
      ...createDto,
      venueId: new Types.ObjectId(createDto.venueId),
      eventDate: new Date(createDto.eventDate),
      userId: userId ? new Types.ObjectId(userId) : undefined,
    });

    const savedLead = await lead.save();

    // Send email notification to venue owner
    try {
      const venue = await this.venuesService.findById(createDto.venueId);
      if (venue.contactEmail) {
        await this.mailService.sendNewLeadNotification(
          venue.contactEmail,
          {
            venueName: venue.name,
            customerName: createDto.customerName,
            customerEmail: createDto.customerEmail,
            customerPhone: createDto.phone,
            eventDate: new Date(createDto.eventDate),
            guestsCount: createDto.guestsCount,
            eventType: createDto.eventType,
            message: createDto.message,
          },
        );
        savedLead.emailSent = true;
        await savedLead.save();
      }
    } catch (error) {
      console.error('Failed to send lead notification email:', error);
    }

    return savedLead;
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    venueId?: string;
    status?: LeadStatus;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{ leads: LeadDocument[]; total: number; pages: number }> {
    const { page = 1, limit = 20, venueId, status, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (venueId) filter.venueId = new Types.ObjectId(venueId);
    if (status) filter.status = status;
    if (startDate && endDate) {
      filter.eventDate = { $gte: startDate, $lte: endDate };
    }

    const [leads, total] = await Promise.all([
      this.leadModel
        .find(filter)
        .populate('venueId', 'name mainImage')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.leadModel.countDocuments(filter),
    ]);

    return {
      leads,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<LeadDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid lead ID');
    }

    const lead = await this.leadModel
      .findById(id)
      .populate('venueId', 'name mainImage location contactEmail contactPhone');

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    return lead;
  }

  async findByVenue(venueId: string, query: {
    page?: number;
    limit?: number;
    status?: LeadStatus;
  }): Promise<{ leads: LeadDocument[]; total: number; pages: number }> {
    const { page = 1, limit = 20, status } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
      venueId: new Types.ObjectId(venueId),
    };
    if (status) filter.status = status;

    const [leads, total] = await Promise.all([
      this.leadModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.leadModel.countDocuments(filter),
    ]);

    return {
      leads,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async update(id: string, updateDto: UpdateLeadDto): Promise<LeadDocument> {
    const lead = await this.findById(id);

    if (updateDto.status && updateDto.status !== lead.status) {
      lead.lastContactDate = new Date();
    }

    Object.assign(lead, updateDto);
    return lead.save();
  }

  async updateStatus(id: string, status: LeadStatus): Promise<LeadDocument> {
    const lead = await this.findById(id);
    lead.status = status;
    lead.lastContactDate = new Date();
    return lead.save();
  }

  async delete(id: string): Promise<void> {
    const result = await this.leadModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Lead not found');
    }
  }

  async getStats(venueId?: string): Promise<{
    total: number;
    byStatus: Record<string, number>;
    thisMonth: number;
    conversionRate: number;
  }> {
    const filter: Record<string, unknown> = {};
    if (venueId) filter.venueId = new Types.ObjectId(venueId);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [total, statusAggregation, thisMonth, confirmed] = await Promise.all([
      this.leadModel.countDocuments(filter),
      this.leadModel.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      this.leadModel.countDocuments({
        ...filter,
        createdAt: { $gte: startOfMonth },
      }),
      this.leadModel.countDocuments({
        ...filter,
        status: LeadStatus.Confirmed,
      }),
    ]);

    const byStatus: Record<string, number> = {};
    statusAggregation.forEach((item: { _id: string; count: number }) => {
      byStatus[item._id] = item.count;
    });

    const conversionRate = total > 0 ? Math.round((confirmed / total) * 100) : 0;

    return {
      total,
      byStatus,
      thisMonth,
      conversionRate,
    };
  }
}
