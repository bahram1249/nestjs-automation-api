import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { DiscountDto } from './discount.dto';

export class GetDiscountConditionDto extends IntersectionType(
  ListFilter,
  DiscountDto,
) {}
