import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { EntityTypeFilterDto } from './entity-type-filter.dto';
import { BrandFilterDto } from './brand-filter.dto';
import { ColorFilterDto } from './color-filter.dto';
import { VendorFilterDto } from './vendor-filter.dto';
import { AttributeFilterDto } from './attribute.filter.dto';
import { InventoryFilterDto } from './inventory-filter.dto';
import { InventoryStatusDto } from './inventory-status.dto';
import { DiscountTypeDto } from './discount-type.dto';
import { SelectedProductDto } from './selected-product.dto';
import { ProductInventoryPairsFilterDto } from './product-inventory-pairs-filter.dto';
import { VendorsFilterDto } from './vendors-filter.dto';
import { ProductIdsFilterDto } from './product-ids-filter.dto';

export class GetUnPriceDto extends IntersectionType(
  ListFilter,
  EntityTypeFilterDto,
  BrandFilterDto,
  ColorFilterDto,
  VendorFilterDto,
  VendorsFilterDto,
  InventoryFilterDto,
  AttributeFilterDto,
  InventoryStatusDto,
  DiscountTypeDto,
  SelectedProductDto,
  ProductInventoryPairsFilterDto,
  ProductIdsFilterDto,
) {}
