import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { PaymentTransactionDto } from './payment-transaction.dto';

export class GetPaymentTransactionDto extends IntersectionType(
  PaymentTransactionDto,
  ListFilter,
) {}
