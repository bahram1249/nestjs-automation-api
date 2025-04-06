import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';

export class GetOnlinePaymentGatewayDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
) {}
