import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from './user.entity';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName!: string;

  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(12)
  @MaxLength(128)
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  fullName?: string;

  @IsOptional()
  @Transform(({ value }: { value: string }) => value.trim().toLowerCase())
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
