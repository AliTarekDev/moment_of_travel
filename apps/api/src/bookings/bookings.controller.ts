import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Public, Roles } from '../common/auth.decorators';
import { UserRole } from '../users/user.entity';
import { BookingQueryDto, CreateBookingDto, UpdateBookingDto, UpdatePaymentDto } from './bookings.dto';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Post('public')
  @Public()
  async createPublic(@Body() dto: CreateBookingDto) {
    const booking = await this.bookings.createPublic(dto);
    return { reference: booking.reference, status: booking.status, createdAt: booking.createdAt };
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPTION, UserRole.ACCOUNTANT)
  findAll(@Query() query: BookingQueryDto) {
    return this.bookings.findAll(query);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPTION, UserRole.ACCOUNTANT)
  findOne(@Param('id') id: string) {
    return this.bookings.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPTION)
  update(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookings.update(id, dto);
  }

  @Patch(':id/payment')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.ACCOUNTANT)
  updatePayment(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.bookings.updatePayment(id, dto);
  }
}
