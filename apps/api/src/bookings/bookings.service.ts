import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomInt } from 'node:crypto';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Booking, BookingStatus, PaymentStatus } from './booking.entity';
import { BookingQueryDto, CreateBookingDto, UpdateBookingDto, UpdatePaymentDto } from './bookings.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private readonly bookings: Repository<Booking>,
    private readonly users: UsersService,
  ) {}

  async createPublic(dto: CreateBookingDto): Promise<Booking> {
    const booking = this.bookings.create({
      ...dto,
      customerName: dto.customerName.trim(),
      customerPhone: dto.customerPhone.trim(),
      destination: dto.destination.trim(),
      departureCity: dto.departureCity?.trim() || null,
      departureDate: dto.departureDate ?? null,
      returnDate: dto.returnDate ?? null,
      tripType: dto.tripType ?? null,
      urgent: dto.urgent ?? false,
      includesTickets: dto.includesTickets ?? false,
      includesHotels: dto.includesHotels ?? false,
      includesTransport: dto.includesTransport ?? false,
      customerNotes: dto.customerNotes?.trim() || null,
      reference: await this.createReference(),
    });
    return this.bookings.save(booking);
  }

  async findAll(query: BookingQueryDto) {
    const builder = this.bookings
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.assignedTo', 'assignedTo')
      .orderBy('booking.createdAt', 'DESC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit);

    if (query.status) builder.andWhere('booking.status = :status', { status: query.status });
    if (query.search?.trim()) {
      builder.andWhere(
        '(booking.reference ILIKE :search OR booking.customerName ILIKE :search OR booking.customerEmail ILIKE :search OR booking.destination ILIKE :search)',
        { search: `%${query.search.trim()}%` },
      );
    }

    const [data, total] = await builder.getManyAndCount();
    return { data, meta: { page: query.page, limit: query.limit, total } };
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookings.findOne({ where: { id }, relations: { assignedTo: true } });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async update(id: string, dto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);
    if (dto.assignedToId) {
      const assignee = await this.users.findById(dto.assignedToId);
      if (!assignee.active) throw new NotFoundException('Assigned user is inactive');
    }

    if (dto.status !== undefined) booking.status = dto.status;
    if (dto.assignedToId !== undefined) booking.assignedToId = dto.assignedToId;
    if (dto.internalNotes !== undefined) booking.internalNotes = dto.internalNotes.trim() || null;
    if (dto.totalAmount !== undefined) booking.totalAmount = dto.totalAmount.toFixed(2);
    if (dto.currency !== undefined) booking.currency = dto.currency.toUpperCase();
    await this.bookings.save(booking);
    return this.findOne(id);
  }

  async updatePayment(id: string, dto: UpdatePaymentDto): Promise<Booking> {
    const booking = await this.findOne(id);
    booking.paymentStatus = dto.paymentStatus;
    await this.bookings.save(booking);
    return this.findOne(id);
  }

  async summary() {
    const rows = await this.bookings
      .createQueryBuilder('booking')
      .select('booking.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('booking.status')
      .getRawMany<{ status: BookingStatus; count: string }>();
    const statusCounts = Object.values(BookingStatus).reduce<Record<BookingStatus, number>>(
      (counts, status) => ({ ...counts, [status]: 0 }),
      {} as Record<BookingStatus, number>,
    );
    for (const row of rows) statusCounts[row.status] = Number(row.count);

    const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
    const revenue = await this.bookings
      .createQueryBuilder('booking')
      .select('COALESCE(SUM(booking.totalAmount), 0)', 'total')
      .where('booking.paymentStatus = :paid', { paid: PaymentStatus.PAID })
      .getRawOne<{ total: string }>();
    return { total, statusCounts, paidRevenue: Number(revenue?.total ?? 0), currency: 'EGP' };
  }

  private async createReference(): Promise<string> {
    const year = new Date().getUTCFullYear();
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const reference = `MOT-${year}-${randomInt(100000, 1000000)}`;
      if (!(await this.bookings.existsBy({ reference }))) return reference;
    }
    throw new Error('Unable to create a unique booking reference');
  }
}
