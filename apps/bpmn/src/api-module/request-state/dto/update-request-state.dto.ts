import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateRequestStateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  requestId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  activityId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  roleId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  organizationId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  returnRequestStateId?: number;
}
