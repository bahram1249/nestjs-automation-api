import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { ListFilter } from '@rahino/query-filter';
import { Type } from 'class-transformer';

class ActionFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  actionTypeId?: number;
}

export class GetActionDto extends IntersectionType(
  ListFilter,
  ActionFilterDto,
) {}
