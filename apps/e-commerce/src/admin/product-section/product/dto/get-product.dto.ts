import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { IncludeAttributeFilterDto } from './include-attribute.dto';
import { EntityTypeFilterDto } from './entity-type-filter.dto';
import { BrandFilterDto } from './brand.filter.dto';
import { InventoryStatusFilterDto } from './inventory-status-filter.dto';

export class GetProductDto extends IntersectionType(
  ListFilter,
  IncludeAttributeFilterDto,
  EntityTypeFilterDto,
  BrandFilterDto,
  InventoryStatusFilterDto,
) {}
