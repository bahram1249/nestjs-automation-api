import { User } from '@rahino/database';
import { ListFilter } from '@rahino/query-filter';
import { ConditionValueResInterface } from './condition-value-res.interface';

export interface ConditionValueSourceInterface {
  findAll(user: User, filter: ListFilter): Promise<ConditionValueResInterface>;
}
