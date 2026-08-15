import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { BookingStatus, PaymentStatus, ServiceType } from './booking.entity';

export class CreateBookingDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  customerName!: string;

  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  @IsEmail()
  customerEmail!: string;

  @IsString()
  @MinLength(7)
  @MaxLength(40)
  customerPhone!: string;

  @IsEnum(ServiceType)
  serviceType!: ServiceType;

  @IsString()
  @MinLength(2)
  @MaxLength(140)
  destination!: string;

  @IsOptional()
  @IsString()
  @MaxLength(140)
  departureCity?: string;

  @IsOptional()
  @IsDateString()
  departureDate?: string;

  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @IsOptional()
  @IsIn(['one_way', 'round_trip'])
  tripType?: 'one_way' | 'round_trip';

  @IsOptional()
  @IsBoolean()
  urgent?: boolean;

  @IsOptional()
  @IsBoolean()
  includesTickets?: boolean;

  @IsOptional()
  @IsBoolean()
  includesHotels?: boolean;

  @IsOptional()
  @IsBoolean()
  includesTransport?: boolean;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  travelers!: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  customerNotes?: string;
}

export class BookingQueryDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;
}

export class UpdateBookingDto {
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsUUID()
  assignedToId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  internalNotes?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalAmount?: number;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;
}

export class UpdatePaymentDto {
  @IsEnum(PaymentStatus)
  paymentStatus!: PaymentStatus;
}
