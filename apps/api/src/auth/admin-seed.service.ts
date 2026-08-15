import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly users: UsersService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const email = this.config.get<string>('ADMIN_EMAIL')?.trim().toLowerCase();
    const password = this.config.get<string>('ADMIN_PASSWORD');
    if (!email || !password) {
      this.logger.warn('ADMIN_EMAIL and ADMIN_PASSWORD are not set; no initial administrator was created.');
      return;
    }
    if (password.length < 12) throw new Error('ADMIN_PASSWORD must contain at least 12 characters');

    const existing = await this.users.findForAuthentication(email);
    if (existing) return;
    await this.users.create({
      fullName: this.config.get('ADMIN_NAME', 'System Administrator'),
      email,
      password,
      role: UserRole.ADMIN,
    });
    this.logger.log(`Initial administrator created for ${email}`);
  }
}
