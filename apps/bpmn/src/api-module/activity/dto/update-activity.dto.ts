import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateActivityDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isStartActivity?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isEndActivity?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  activityTypeId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  processId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  haveMultipleItems?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  insideProcessRunnerId?: number;
}
