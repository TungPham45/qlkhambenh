import { Transform } from 'class-transformer';
import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Gender } from '@app/common';

const cleanOptional = ({ value }: { value: any }) => typeof value === 'string' ? value.trim() || null : value;

export class ProfileDto {
  @Transform(cleanOptional) @IsOptional() @IsString() @MaxLength(150)
  fullName?: string;

  @Transform(cleanOptional) @IsOptional() @IsString() @MaxLength(20)
  phone?: string;

  @Transform(cleanOptional) @IsOptional() @IsEmail() @MaxLength(150)
  email?: string;

  @Transform(cleanOptional) @IsOptional() @IsDateString()
  dateOfBirth?: string;

  @Transform(cleanOptional) @IsOptional() @IsEnum(Gender)
  gender?: Gender;

  @Transform(cleanOptional) @IsOptional() @IsString() @MaxLength(255)
  address?: string;

  @Transform(cleanOptional) @IsOptional() @IsString() @MaxLength(50)
  healthInsuranceNumber?: string;
}
