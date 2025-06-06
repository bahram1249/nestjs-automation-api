import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter';
import { EntityModelFilter, ParentEntityTypeFilter } from '../filter';
import { IgnoreChildFilter } from '../filter/ignore-child.filter';
import { VendorFilter } from '../filter/vendor.filter';
import { InventoryStatusFilter } from '../filter/inventory-status.filter';

export class GetEntityTypeDto extends IntersectionType(
  ListFilter,
  IgnorePagingFilter,
  EntityModelFilter,
  ParentEntityTypeFilter,
  VendorFilter,
  IgnoreChildFilter,
  InventoryStatusFilter,
) {}
