import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { EntityTypeFilterDto } from './entity-type-filter.dto';
import { BrandFilterDto } from './brand-filter.dto';
import { ColorFilterDto } from './color-filter.dto';
import { VendorFilterDto } from './vendor-filter.dto';
import { AttributeFilterDto } from './attribute.filter.dto';
import { InventoryFilterDto } from './inventory-filter.dto';
import { PriceFilterDto } from './price.filter';

export class GetProductDto extends IntersectionType(
  ListFilter,
  EntityTypeFilterDto,
  BrandFilterDto,
  ColorFilterDto,
  VendorFilterDto,
  InventoryFilterDto,
  AttributeFilterDto,
  PriceFilterDto,
) {}
