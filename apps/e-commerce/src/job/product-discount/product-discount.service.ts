import { Injectable } from '@nestjs/common';
import { ListFilter } from '@rahino/query-filter';
import { ProductQueryBuilderService } from '../../client/product/service';
import { InjectModel } from '@nestjs/sequelize';
import { ECProduct } from '@rahino/localdatabase/models';
import { ProductDiscountSetterService } from './product-discount-setter.service';
import * as _ from 'lodash';
import { InventoryStatusEnum } from '@rahino/ecommerce/shared/inventory/enum';

@Injectable()
export class ProductDiscountService {
  constructor(
    @InjectModel(ECProduct)
    private readonly repository: typeof ECProduct,
    private readonly productQueryBuilderService: ProductQueryBuilderService,
    private readonly productDiscountSetterService: ProductDiscountSetterService,
  ) {}
  async fetchAndApplyDiscountTime(filter: ListFilter) {
    let more = true;
    let page = 1;
    while (more) {
      const { resultQuery, countQuery } =
        await this.productQueryBuilderService.findAllAndCountQuery(
          _.extend(filter, {
            inventoryStatusId: InventoryStatusEnum.available,
          }),
        );
      const results = await this.repository.findAll(resultQuery);
      const total = await this.repository.count(countQuery);
      await this.productDiscountSetterService.applyProducts(results);
      if (filter.limit + filter.offset >= total) {
        more = false;
      }
      page += 1;
      filter.offset = filter.limit * (page - 1);
    }
  }
}
