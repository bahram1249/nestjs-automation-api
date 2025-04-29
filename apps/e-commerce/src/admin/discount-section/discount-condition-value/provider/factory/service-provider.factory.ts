import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { DiscountConditionTypeEnum } from '@rahino/ecommerce/admin/discount-section/discount-condition-type/enum';
import {
  ProductMiddleService,
  EntityTypeMiddleService,
  InventoryMiddleService,
  VendorMiddleService,
} from '../services';

@Injectable({ scope: Scope.REQUEST })
export class ServiceProviderFactory {
  constructor(
    @Inject(REQUEST)
    private request: Request,
    private productService: ProductMiddleService,
    private entityTypeService: EntityTypeMiddleService,
    private inventoryService: InventoryMiddleService,
    private vendorService: VendorMiddleService,
  ) {}

  create() {
    const conditionType = Number(this.request?.query?.conditionTypeId);
    switch (conditionType) {
      case DiscountConditionTypeEnum.product:
        return this.productService;
      case DiscountConditionTypeEnum.entityType:
        return this.entityTypeService;
      case DiscountConditionTypeEnum.inventory:
        return this.inventoryService;
      case DiscountConditionTypeEnum.vendor:
        return this.vendorService;
      default:
        throw new NotFoundException(`Invalid data source: ${conditionType}`);
    }
  }
}
