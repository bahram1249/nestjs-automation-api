import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class CreateRequestStateDto {
  @ApiProperty()
  @IsInt()
  requestId: number;

  @ApiProperty()
  @IsInt()
  activityId: number;

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
