import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter/types/list-filter';
import { DateFilter } from '@rahino/query-filter/types/date-filter';
import { NumberFilter } from '@rahino/query-filter/types/number-filter';

export class GetPaymentTransactionDto extends IntersectionType(
  ListFilter,
  DateFilter,
  NumberFilter,
) {}
