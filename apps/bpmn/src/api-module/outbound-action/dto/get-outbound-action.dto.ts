import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { ListFilter } from '@rahino/query-filter';
import { Type } from 'class-transformer';

class OutboundActionFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  activityId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  actionId?: number;
}

export class GetOutboundActionDto extends IntersectionType(
  ListFilter,
  OutboundActionFilterDto,
) {}
