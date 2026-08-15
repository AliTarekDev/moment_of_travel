import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum CatalogDivision {
  TRAVEL = 'travel',
  AVIATION = 'aviation',
}

export enum CatalogType {
  TRIP = 'trip',
  OFFER = 'offer',
  DESTINATION = 'destination',
  HOTEL = 'hotel',
  FLIGHT = 'flight',
  SERVICE = 'service',
}

export enum CatalogStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity({ name: 'catalog_items' })
@Index(['status', 'division', 'sortOrder'])
export class CatalogItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 180 })
  slug!: string;

  @Column({ type: 'varchar', length: 20 })
  division!: CatalogDivision;

  @Column({ type: 'varchar', length: 24 })
  type!: CatalogType;

  @Column({ type: 'varchar', length: 20, default: CatalogStatus.DRAFT })
  status!: CatalogStatus;

  @Column({ length: 180 })
  titleAr!: string;

  @Column({ length: 180 })
  titleEn!: string;

  @Column({ type: 'text' })
  summaryAr!: string;

  @Column({ type: 'text' })
  summaryEn!: string;

  @Column({ type: 'text', nullable: true })
  descriptionAr!: string | null;

  @Column({ type: 'text', nullable: true })
  descriptionEn!: string | null;

  @Column({ type: 'varchar', length: 180, nullable: true })
  locationAr!: string | null;

  @Column({ type: 'varchar', length: 180, nullable: true })
  locationEn!: string | null;

  @Column({ type: 'text', nullable: true })
  imageUrl!: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  price!: string | null;

  @Column({ length: 3, default: 'SAR' })
  currency!: string;

  @Column({ type: 'date', nullable: true })
  startDate!: string | null;

  @Column({ type: 'date', nullable: true })
  endDate!: string | null;

  @Column({ default: false })
  featured!: boolean;

  @Column({ type: 'integer', default: 0 })
  sortOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
