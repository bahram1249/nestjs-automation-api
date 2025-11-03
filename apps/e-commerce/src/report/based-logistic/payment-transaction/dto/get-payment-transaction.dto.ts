import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { PaymentTransactionFilterDto } from './payment-transaction-filter.dto';

export class GetPaymentTransactionDto extends IntersectionType(
  PaymentTransactionFilterDto,
  ListFilter,
) {}
