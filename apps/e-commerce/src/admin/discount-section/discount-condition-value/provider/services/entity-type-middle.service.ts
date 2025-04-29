import { Injectable } from '@nestjs/common';
import {
  ConditionValueResInterface,
  ConditionValueSourceInterface,
  KeyValueInterface,
} from '../interface';
import { ListFilter } from '@rahino/query-filter';
import { User } from '@rahino/database';
import { EntityTypeService } from '@rahino/eav/admin/entity-type/entity-type.service';
import * as _ from 'lodash';

@Injectable()
export class EntityTypeMiddleService implements ConditionValueSourceInterface {
  constructor(private readonly entityTypeService: EntityTypeService) {}
  async findAll(
    user: User,
    filter: ListFilter,
  ): Promise<ConditionValueResInterface> {
    const res = await this.entityTypeService.findAll(filter);
    return {
      result: res.result.map<KeyValueInterface>((item) => {
        return { key: item.id, value: item.name };
      }),
      total: res.total,
    };
  }
}
