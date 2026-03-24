import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AvailabilityStatus,
  Availability,
  AvailabilityDocument,
  TimeSlot,
} from './schemas/availability.schema';
import { CreateAvailabilityDto } from './dto/createAvailability.dto';
import { UpdateAvailabilityDto } from './dto/updateAvailability.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectModel(Availability.name)
    private availabilityModel: Model<AvailabilityDocument>,
  ) { }

  private toObjectId(id: string): Types.ObjectId {
    return new Types.ObjectId(id);
  }

  private getDayBounds(date: Date): { startOfDay: Date; endOfDay: Date } {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return { startOfDay, endOfDay };
  }

  private resolveStatus(
    explicitStatus: AvailabilityStatus | undefined,
    isAvailable: boolean | undefined,
  ): AvailabilityStatus {
    if (explicitStatus) {
      return explicitStatus;
    }

    return isAvailable === false
      ? AvailabilityStatus.Booked
      : AvailabilityStatus.Available;
  }

  private resolveIsAvailable(
    explicitIsAvailable: boolean | undefined,
    status: AvailabilityStatus,
  ): boolean {
    if (typeof explicitIsAvailable === 'boolean') {
      return explicitIsAvailable;
    }

    return status === AvailabilityStatus.Available;
  }

  async create(createDto: CreateAvailabilityDto): Promise<AvailabilityDocument> {
    const parsedDate = new Date(createDto.date);
    const status = this.resolveStatus(createDto.status, createDto.isAvailable);
    const isAvailable = this.resolveIsAvailable(createDto.isAvailable, status);

    // Check for existing entry
    const existing = await this.availabilityModel.findOne({
      venueId: this.toObjectId(createDto.venueId),
      date: parsedDate,
      slot: createDto.slot,
    });

    if (existing) {
      throw new ConflictException('Availability entry already exists for this date and slot');
    }

    const availability = new this.availabilityModel({
      ...createDto,
      venueId: this.toObjectId(createDto.venueId),
      date: parsedDate,
      status,
      isAvailable,
    });

    return availability.save();
  }

  async findByVenue(
    venueId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<AvailabilityDocument[]> {
    const filter: Record<string, unknown> = {
      venueId: this.toObjectId(venueId),
    };

    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      filter.date = { $gte: startDate };
    }

    return this.availabilityModel.find(filter).sort({ date: 1 }).exec();
  }

  async findByDate(
    venueId: string,
    date: Date,
  ): Promise<AvailabilityDocument[]> {
    const { startOfDay, endOfDay } = this.getDayBounds(date);

    return this.availabilityModel
      .find({
        venueId: this.toObjectId(venueId),
        date: { $gte: startOfDay, $lte: endOfDay },
      })
      .exec();
  }

  async checkAvailability(
    venueId: string,
    date: Date,
    slot: TimeSlot,
  ): Promise<boolean> {
    const { startOfDay, endOfDay } = this.getDayBounds(date);

    // Check for FullDay booking
    const fullDayBooking = await this.availabilityModel.findOne({
      venueId: this.toObjectId(venueId),
      date: { $gte: startOfDay, $lte: endOfDay },
      slot: TimeSlot.FullDay,
      isAvailable: false,
    });

    if (fullDayBooking) return false;

    // If requesting FullDay, check if any slot is taken
    if (slot === TimeSlot.FullDay) {
      const anyBooking = await this.availabilityModel.findOne({
        venueId: this.toObjectId(venueId),
        date: { $gte: startOfDay, $lte: endOfDay },
        isAvailable: false,
      });
      return !anyBooking;
    }

    // Check specific slot
    const slotBooking = await this.availabilityModel.findOne({
      venueId: this.toObjectId(venueId),
      date: { $gte: startOfDay, $lte: endOfDay },
      slot,
      isAvailable: false,
    });

    return !slotBooking;
  }

  async update(
    id: string,
    updateDto: UpdateAvailabilityDto,
  ): Promise<AvailabilityDocument> {
    const status = this.resolveStatus(updateDto.status, updateDto.isAvailable);
    const isAvailable = this.resolveIsAvailable(updateDto.isAvailable, status);

    const normalizedUpdate: UpdateAvailabilityDto = {
      ...updateDto,
      status,
      isAvailable,
    };

    const availability = await this.availabilityModel.findByIdAndUpdate(
      id,
      normalizedUpdate,
      { new: true },
    );

    if (!availability) {
      throw new NotFoundException('Availability entry not found');
    }

    return availability;
  }

  async setUnavailable(
    venueId: string,
    date: Date,
    slot: TimeSlot,
    bookingRef?: string,
  ): Promise<AvailabilityDocument> {
    const { startOfDay, endOfDay } = this.getDayBounds(date);

    // If FullDay, mark all slots as unavailable
    if (slot === TimeSlot.FullDay) {
      await this.availabilityModel.updateMany(
        {
          venueId: this.toObjectId(venueId),
          date: { $gte: startOfDay, $lte: endOfDay },
        },
        { isAvailable: false, status: AvailabilityStatus.Booked },
      );
    }

    // Create or update the availability entry
    const existing = await this.availabilityModel.findOne({
      venueId: this.toObjectId(venueId),
      date: { $gte: startOfDay, $lte: endOfDay },
      slot,
    });

    if (existing) {
      existing.isAvailable = false;
      existing.status = AvailabilityStatus.Booked;
      if (bookingRef) {
        existing.bookingRef = new Types.ObjectId(bookingRef);
      }
      return existing.save();
    }

    const availability = new this.availabilityModel({
      venueId: this.toObjectId(venueId),
      date: startOfDay,
      slot,
      isAvailable: false,
      status: AvailabilityStatus.Booked,
      bookingRef: bookingRef ? new Types.ObjectId(bookingRef) : undefined,
    });

    return availability.save();
  }

  async delete(id: string): Promise<void> {
    const result = await this.availabilityModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('Availability entry not found');
    }
  }

  async bulkCreate(
    venueId: string,
    entries: Array<{ date: Date; slot: TimeSlot; isAvailable: boolean }>,
  ): Promise<AvailabilityDocument[]> {
    const operations = entries.map((entry) => ({
      updateOne: {
        filter: {
          venueId: this.toObjectId(venueId),
          date: new Date(entry.date),
          slot: entry.slot,
        },
        update: {
          $set: {
            venueId: this.toObjectId(venueId),
            date: new Date(entry.date),
            slot: entry.slot,
            isAvailable: entry.isAvailable,
            status: entry.isAvailable
              ? AvailabilityStatus.Available
              : AvailabilityStatus.Booked,
          },
        },
        upsert: true,
      },
    }));

    await this.availabilityModel.bulkWrite(operations);

    return this.findByVenue(venueId);
  }

  async getMonthAvailability(
    venueId: string,
    year: number,
    month: number,
  ): Promise<Record<string, { morning: boolean; evening: boolean; fullDay: boolean }>> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const entries = await this.findByVenue(venueId, startDate, endDate);

    const result: Record<string, { morning: boolean; evening: boolean; fullDay: boolean }> = {};

    // Initialize all days as available
    for (let day = 1; day <= endDate.getDate(); day++) {
      const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      result[dateKey] = { morning: true, evening: true, fullDay: true };
    }

    // Mark unavailable slots
    for (const entry of entries) {
      const dateKey = entry.date.toISOString().split('T')[0];
      if (result[dateKey]) {
        if (entry.slot === TimeSlot.FullDay && !entry.isAvailable) {
          result[dateKey] = { morning: false, evening: false, fullDay: false };
        } else if (entry.slot === TimeSlot.Morning && !entry.isAvailable) {
          result[dateKey].morning = false;
          result[dateKey].fullDay = false;
        } else if (entry.slot === TimeSlot.Evening && !entry.isAvailable) {
          result[dateKey].evening = false;
          result[dateKey].fullDay = false;
        }
      }
    }

    return result;
  }
}
