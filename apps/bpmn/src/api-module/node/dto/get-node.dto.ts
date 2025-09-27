import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { ListFilter } from '@rahino/query-filter';
import { Type } from 'class-transformer';

class NodeFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  fromActivityId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  toActivityId?: number;
}

export class GetNodeDto extends IntersectionType(ListFilter, NodeFilterDto) {}
