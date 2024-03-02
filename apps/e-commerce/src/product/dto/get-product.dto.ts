import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { EntityTypeFilterDto } from './entity-type-filter.dto';
import { BrandFilterDto } from './brand-filter.dto';
import { ColorFilterDto } from './color-filter.dto';
import { VendorFilterDto } from './vendor-filter.dto';

export class GetProductDto extends IntersectionType(
  ListFilter,
  EntityTypeFilterDto,
  BrandFilterDto,
  ColorFilterDto,
  VendorFilterDto,
) {}
