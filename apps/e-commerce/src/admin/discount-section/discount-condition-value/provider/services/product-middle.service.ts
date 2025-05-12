import { Injectable } from '@nestjs/common';
import {
  ConditionValueResInterface,
  ConditionValueSourceInterface,
  KeyValueInterface,
} from '../interface';
import { ListFilter } from '@rahino/query-filter';
import { User } from '@rahino/database';
import { ProductService } from '@rahino/ecommerce/admin/product-section/product/product.service';

@Injectable()
export class ProductMiddleService implements ConditionValueSourceInterface {
  constructor(private readonly service: ProductService) {}
  async findAll(
    user: User,
    filter: ListFilter,
  ): Promise<ConditionValueResInterface> {
    const res = await this.service.findAll(user, filter);
    return {
      result: res.result.map<KeyValueInterface>((item) => {
        return { key: Number(item.id), value: item.title };
      }),
      total: res.total,
    };
  }
}
