import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';

export class IrangsImportDataGetDto extends IntersectionType(ListFilter) {}
