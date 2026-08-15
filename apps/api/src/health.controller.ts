import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Public } from './common/auth.decorators';

@Controller('health')
export class HealthController {
  constructor(private readonly database: DataSource) {}

  @Get()
  @Public()
  async health(): Promise<{ status: 'ok'; database: 'up'; timestamp: string }> {
    await this.database.query('SELECT 1');
    return { status: 'ok', database: 'up', timestamp: new Date().toISOString() };
  }
}
