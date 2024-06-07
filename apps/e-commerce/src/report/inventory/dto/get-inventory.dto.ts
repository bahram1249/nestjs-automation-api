import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { InventoryDto } from './inventory.dto';

export class GetInventoryDto extends IntersectionType(
  ListFilter,
  InventoryDto,
) {}
