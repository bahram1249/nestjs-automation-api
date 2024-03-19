import { Injectable } from '@nestjs/common';
import {
  ConditionValueResInterface,
  ConditionValueSourceInterface,
  KeyValueInterface,
} from '../interface';
import { ListFilter } from '@rahino/query-filter';
import { User } from '@rahino/database/models/core/user.entity';
import { UserVendorService } from '@rahino/ecommerce/user/vendor/user-vendor.service';

@Injectable()
export class VendorMiddleService implements ConditionValueSourceInterface {
  constructor(private service: UserVendorService) {}
  async findAll(
    user: User,
    filter: ListFilter,
  ): Promise<ConditionValueResInterface> {
    const res = await this.service.findAll(user, filter);
    return {
      result: res.result.map<KeyValueInterface>((item) => {
        return { key: BigInt(item.id), value: item.name };
      }),
      total: res.total,
    };
  }
}
