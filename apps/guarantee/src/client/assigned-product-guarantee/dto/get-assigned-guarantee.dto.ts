import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';

export class GetAssignedProductGuarantee extends IntersectionType(ListFilter) {}
