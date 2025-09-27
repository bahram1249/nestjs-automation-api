import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateNodeDto {
  @ApiProperty()
  @IsInt()
  fromActivityId: number;

  @ApiProperty()
  @IsInt()
  toActivityId: number;

  @ApiProperty()
  @IsBoolean()
  autoIterate: boolean;

  @ApiProperty()
  @IsInt()
  referralTypeId: number;

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
