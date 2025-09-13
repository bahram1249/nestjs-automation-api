import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { LogisticOrderDto } from './logistic-order.dto';

export class GetLogisticOrderDto extends IntersectionType(
  LogisticOrderDto,
  ListFilter,
) {}
