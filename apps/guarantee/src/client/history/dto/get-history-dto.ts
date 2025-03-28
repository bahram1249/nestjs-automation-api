import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';

export class GetHistoryDto extends IntersectionType(ListFilter) {}
