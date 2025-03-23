import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';
import { GetHistoryRequestFilterDto } from './get-history-request-filter.dto';

export class GetHistoryDto extends IntersectionType(
  ListFilter,
  GetHistoryRequestFilterDto,
  IgnorePagingFilter,
) {}
