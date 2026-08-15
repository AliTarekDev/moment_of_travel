import { Controller, Get } from '@nestjs/common';
import { Roles } from '../common/auth.decorators';
import { BookingsService } from '../bookings/bookings.service';
import { UserRole } from '../users/user.entity';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly bookings: BookingsService) {}

  @Get('summary')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPTION, UserRole.ACCOUNTANT)
  summary() {
    return this.bookings.summary();
  }
}
