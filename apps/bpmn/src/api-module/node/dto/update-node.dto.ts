import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateNodeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  fromActivityId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  toActivityId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoIterate?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  referralTypeId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  conditionFailedActionRunnerId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  roleId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  injectForm?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  eventCall?: boolean;
}
