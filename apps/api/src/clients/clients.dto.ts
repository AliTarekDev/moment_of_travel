import { Transform, Type } from 'class-transformer';
import { IsDateString, IsEmail, IsEnum, IsInt, IsOptional, IsString, Length, Max, MaxLength, Min, MinLength } from 'class-validator';
import { ClientGender, MaritalStatus } from './client.entity';

export class CreateClientDto {
  @IsString() @MinLength(2) @MaxLength(160) fullName!:string;
  @IsString() @MinLength(7) @MaxLength(40) mobile!:string;
  @IsOptional() @IsString() @MaxLength(40) whatsapp?:string;
  @IsOptional() @Transform(({value}:{value:string})=>value?.trim().toLowerCase()) @IsEmail() email?:string;
  @IsString() @Length(2,2) nationality!:string;
  @IsDateString() birthDate!:string;
  @IsEnum(ClientGender) gender!:ClientGender;
  @IsEnum(MaritalStatus) maritalStatus!:MaritalStatus;
  @IsOptional() @IsString() @MaxLength(160) mahramName?:string;
  @IsOptional() @IsString() @MaxLength(100) mahramRelationship?:string;
  @IsOptional() @IsString() @MaxLength(4000) notes?:string;
  @IsOptional() @IsString() @MaxLength(30) nationalId?:string;
  @IsOptional() @IsString() @MaxLength(30) passportNumber?:string;
  @IsOptional() @IsDateString() passportExpiry?:string;
}

export class UpdateClientDto extends CreateClientDto {}

export class ClientsQueryDto {
  @IsOptional() @IsString() @MaxLength(120) search?:string;
  @Type(()=>Number) @IsInt() @Min(1) page=1;
  @Type(()=>Number) @IsInt() @Min(1) @Max(100) limit=50;
}
