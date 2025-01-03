import { Injectable } from '@nestjs/common';
import {
  ConditionValueResInterface,
  ConditionValueSourceInterface,
  KeyValueInterface,
} from '../interface';
import { ListFilter } from '@rahino/query-filter';
import { User } from '@rahino/database';
import { UserInventoryService } from '@rahino/ecommerce/user/inventory/user-inventory.service';

@Injectable()
export class InventoryMiddleService implements ConditionValueSourceInterface {
  constructor(private readonly service: UserInventoryService) {}
  async findAll(
    user: User,
    filter: ListFilter,
  ): Promise<ConditionValueResInterface> {
    const res = await this.service.findAll(user, filter);
    return {
      result: res.result.map<KeyValueInterface>((item) => {
        return {
          key: Number(item.id),
          value: item.product.title + `(شناسه موجودی:‌ ${item.id})`,
        };
      }),
      total: res.total,
    };
  }
}
