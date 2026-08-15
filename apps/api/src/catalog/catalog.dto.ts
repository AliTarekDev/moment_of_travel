import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CatalogDivision, CatalogStatus, CatalogType } from './catalog-item.entity';

export class CreateCatalogItemDto {
  @IsOptional()
  @IsString()
  @MaxLength(180)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @IsEnum(CatalogDivision)
  division!: CatalogDivision;

  @IsEnum(CatalogType)
  type!: CatalogType;

  @IsOptional()
  @IsEnum(CatalogStatus)
  status?: CatalogStatus;

  @IsString()
  @MinLength(2)
  @MaxLength(180)
  titleAr!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(180)
  titleEn!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(700)
  summaryAr!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(700)
  summaryEn!: string;

  @IsOptional()
  @IsString()
  @MaxLength(6000)
  descriptionAr?: string;

  @IsOptional()
  @IsString()
  @MaxLength(6000)
  descriptionEn?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  locationAr?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  locationEn?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(2000)
  imageUrl?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;

  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim().toUpperCase())
  @IsString()
  @Length(3, 3)
  currency?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(-10000)
  @Max(10000)
  sortOrder?: number;
}

export class UpdateCatalogItemDto extends CreateCatalogItemDto {}

export class CatalogQueryDto {
  @IsOptional()
  @IsEnum(CatalogDivision)
  division?: CatalogDivision;

  @IsOptional()
  @IsEnum(CatalogType)
  type?: CatalogType;

  @IsOptional()
  @IsEnum(CatalogStatus)
  status?: CatalogStatus;

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
  limit = 30;
}
