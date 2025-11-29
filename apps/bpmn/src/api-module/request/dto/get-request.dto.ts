import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { ListFilter } from '@rahino/query-filter';
import { Type } from 'class-transformer';

class RequestFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  processId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  organizationId?: number;
}

export class GetRequestDto extends IntersectionType(
  ListFilter,
  RequestFilterDto,
) {}
