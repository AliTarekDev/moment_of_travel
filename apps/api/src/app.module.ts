import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Booking } from './bookings/booking.entity';
import { BookingsModule } from './bookings/bookings.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { HealthController } from './health.controller';
import { CatalogItem } from './catalog/catalog-item.entity';
import { CatalogModule } from './catalog/catalog.module';
import { Client } from './clients/client.entity';
import { ClientsModule } from './clients/clients.module';
import { Program } from './programs/program.entity';
import { ProgramsModule } from './programs/programs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['apps/api/.env', '.env'] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProduction = config.get('NODE_ENV') === 'production';
        const synchronize = config.get('DB_SYNCHRONIZE', 'false') === 'true';
        if (isProduction && synchronize) {
          throw new Error('DB_SYNCHRONIZE must be false in production. Use migrations instead.');
        }

        return {
          type: 'postgres' as const,
          url: config.getOrThrow<string>('DATABASE_URL'),
          entities: [User, Booking, CatalogItem, Client, Program],
          synchronize,
          ssl: config.get('DB_SSL', 'false') === 'true' ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    AuthModule,
    UsersModule,
    BookingsModule,
    DashboardModule,
    CatalogModule,
    ClientsModule,
    ProgramsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
