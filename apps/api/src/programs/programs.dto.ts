import { Transform,Type } from 'class-transformer';
import { IsBoolean,IsDateString,IsEnum,IsInt,IsNumber,IsOptional,IsString,IsUrl,Max,MaxLength,Min,MinLength } from 'class-validator';
import { ProgramStatus,ProgramType,ServiceLevel } from './program.entity';
export class CreateProgramDto{
  @IsString() @MinLength(2) @MaxLength(180) name!:string;
  @IsEnum(ProgramType) type!:ProgramType;
  @IsString() @MinLength(2) @MaxLength(100) season!:string;
  @IsEnum(ServiceLevel) serviceLevel!:ServiceLevel;
  @IsOptional() @IsEnum(ProgramStatus) status?:ProgramStatus;
  @IsDateString() departureDate!:string;
  @IsDateString() returnDate!:string;
  @IsOptional() @IsString() @MaxLength(80) ministryPermitNumber?:string;
  @IsOptional() @IsString() @MaxLength(180) makkahHotel?:string;
  @IsOptional() @Type(()=>Number) @IsInt() @Min(1) @Max(5) makkahHotelRating?:number;
  @IsOptional() @Type(()=>Number) @IsInt() @Min(0) @Max(90) makkahNights?:number;
  @IsOptional() @IsString() @MaxLength(180) madinahHotel?:string;
  @IsOptional() @Type(()=>Number) @IsInt() @Min(1) @Max(5) madinahHotelRating?:number;
  @IsOptional() @Type(()=>Number) @IsInt() @Min(0) @Max(90) madinahNights?:number;
  @IsOptional() @IsString() @MaxLength(160) airline?:string;
  @IsOptional() @IsString() @MaxLength(60) flightNumber?:string;
  @IsOptional() @Type(()=>Number) @IsNumber({maxDecimalPlaces:2}) @Min(0) singlePrice?:number;
  @IsOptional() @Type(()=>Number) @IsNumber({maxDecimalPlaces:2}) @Min(0) doublePrice?:number;
  @IsOptional() @Type(()=>Number) @IsNumber({maxDecimalPlaces:2}) @Min(0) triplePrice?:number;
  @IsOptional() @Type(()=>Number) @IsNumber({maxDecimalPlaces:2}) @Min(0) quadruplePrice?:number;
  @IsOptional() @Type(()=>Number) @IsNumber({maxDecimalPlaces:2}) @Min(0) seatCashCost?:number;
  @Type(()=>Number) @IsInt() @Min(1) @Max(100000) totalSeats!:number;
  @Transform(({value})=>value===true||value==='true') @IsBoolean() includesMeals!:boolean;
  @Transform(({value})=>value===true||value==='true') @IsBoolean() includesVisits!:boolean;
  @IsOptional() @IsString() @MaxLength(8000) description?:string;
  @IsOptional() @IsString() @MaxLength(70) seoTitle?:string;
  @IsOptional() @IsString() @MaxLength(180) metaDescription?:string;
  @IsOptional() @IsUrl({require_protocol:true}) @MaxLength(2000) canonicalUrl?:string;
}
export class ProgramsQueryDto{
  @IsOptional() @IsString() @MaxLength(120) search?:string;
  @IsOptional() @IsEnum(ProgramType) type?:ProgramType;
  @IsOptional() @IsEnum(ProgramStatus) status?:ProgramStatus;
  @Type(()=>Number) @IsInt() @Min(1) page=1;
  @Type(()=>Number) @IsInt() @Min(1) @Max(100) limit=50;
}
