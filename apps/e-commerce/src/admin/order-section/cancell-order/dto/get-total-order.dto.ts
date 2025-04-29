import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { TotalOrderFilterDto } from './total-order-filter.dto';

export class GetTotalOrderFilterDto extends IntersectionType(
  ListFilter,
  TotalOrderFilterDto,
) {}
