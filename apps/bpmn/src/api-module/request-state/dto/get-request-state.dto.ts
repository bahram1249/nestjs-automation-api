import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { ListFilter } from '@rahino/query-filter';
import { Type } from 'class-transformer';

class RequestStateFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  requestId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  activityId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  roleId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  organizationId?: number;
}

export class GetRequestStateDto extends IntersectionType(
  ListFilter,
  RequestStateFilterDto,
) {}
