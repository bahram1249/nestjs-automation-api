import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';

export class GetResponseDto extends IntersectionType(ListFilter) {}
