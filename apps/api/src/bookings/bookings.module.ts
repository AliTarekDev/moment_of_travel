import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Booking } from './booking.entity';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { BookingNotificationsService } from './booking-notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), UsersModule],
  controllers: [BookingsController],
  providers: [BookingsService, BookingNotificationsService],
  exports: [BookingsService],
})
export class BookingsModule {}
