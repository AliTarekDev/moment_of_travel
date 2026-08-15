import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum ServiceType {
  FLIGHT = 'flight',
  HOTEL = 'hotel',
  TOUR = 'tour',
  CRUISE = 'cruise',
  CAR = 'car',
  PRIVATE_AVIATION = 'private_aviation',
}

export enum BookingStatus {
  NEW = 'new',
  REVIEWING = 'reviewing',
  QUOTED = 'quoted',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PENDING = 'pending',
  PARTIALLY_PAID = 'partially_paid',
  PAID = 'paid',
  REFUNDED = 'refunded',
}

@Entity({ name: 'bookings' })
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 30 })
  reference!: string;

  @Column({ length: 120 })
  customerName!: string;

  @Column({ length: 180 })
  customerEmail!: string;

  @Column({ length: 40 })
  customerPhone!: string;

  @Column({ type: 'enum', enum: ServiceType })
  serviceType!: ServiceType;

  @Column({ length: 140 })
  destination!: string;

  @Column({ type: 'varchar', length: 140, nullable: true })
  departureCity!: string | null;

  @Column({ type: 'date', nullable: true })
  departureDate!: string | null;

  @Column({ type: 'date', nullable: true })
  returnDate!: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  tripType!: 'one_way' | 'round_trip' | null;

  @Column({ default: false })
  urgent!: boolean;

  @Column({ default: false })
  includesTickets!: boolean;

  @Column({ default: false })
  includesHotels!: boolean;

  @Column({ default: false })
  includesTransport!: boolean;

  @Column({ type: 'smallint', default: 1 })
  travelers!: number;

  @Column({ type: 'text', nullable: true })
  customerNotes!: string | null;

  @Column({ type: 'text', nullable: true })
  internalNotes!: string | null;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.NEW })
  status!: BookingStatus;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.UNPAID })
  paymentStatus!: PaymentStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  totalAmount!: string | null;

  @Column({ length: 3, default: 'EGP' })
  currency!: string;

  @Column({ type: 'uuid', nullable: true })
  assignedToId!: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo!: User | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
