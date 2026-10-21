import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export const CAIRO_SITES = [
  'giza',
  'saqqara',
  'museums',
  'oldCairo',
  'citadel',
  'coptic',
  'other',
] as const;
export const EXTRA_EXPERIENCES = [
  'camel',
  'dance',
  'felucca',
  'balloon',
  'other',
  'none',
] as const;
export class TailorMadeDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  firstName!: string;
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(180)
  email!: string;
  @IsInt() @Min(1) @Max(50) adults!: number;
  @IsInt() @Min(0) @Max(49) children!: number;
  @IsString() @MinLength(2) @MaxLength(140) origin!: string;
  @IsDateString({ strict: true }) arrivalDate!: string;
  @IsDateString({ strict: true }) departureDate!: string;
  @IsIn(['yes', 'no']) flightsBooked!: string;
  @IsString() @MinLength(1) @MaxLength(120) days!: string;
  @IsOptional() @IsString() @MaxLength(800) occasions?: string;
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @ArrayUnique()
  @IsIn(CAIRO_SITES, { each: true })
  cairoSites!: string[];
  @IsIn(['yes', 'no']) luxor!: string;
  @IsIn(['yes', 'no']) aswan!: string;
  @IsIn(['yes', 'no']) abuSimbel!: string;
  @IsIn(['none', 'three', 'four', 'seven']) cruise!: string;
  @IsIn(['yes', 'no']) alexandria!: string;
  @IsOptional() @IsString() @MaxLength(800) otherPlaces?: string;
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  @ArrayUnique()
  @IsIn(EXTRA_EXPERIENCES, { each: true })
  experiences!: string[];
  @IsOptional() @IsString() @MaxLength(800) otherExperiences?: string;
  @IsIn(['yes', 'no']) vip!: string;
  @IsIn(['yes', 'no']) hotels!: string;
  @IsOptional() @IsString() @MaxLength(1200) notes?: string;
}
