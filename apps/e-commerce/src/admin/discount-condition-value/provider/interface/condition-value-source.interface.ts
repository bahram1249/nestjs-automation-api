import { User } from '@rahino/database/models/core/user.entity';
import { ListFilter } from '@rahino/query-filter';
import { ConditionValueResInterface } from './condition-value-res.interface';

export interface ConditionValueSourceInterface {
  findAll(user: User, filter: ListFilter): Promise<ConditionValueResInterface>;
}
