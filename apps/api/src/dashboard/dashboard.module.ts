import { Module } from '@nestjs/common';
import { BookingsModule } from '../bookings/bookings.module';
import { DashboardController } from './dashboard.controller';

@Module({ imports: [BookingsModule], controllers: [DashboardController] })
export class DashboardModule {}
