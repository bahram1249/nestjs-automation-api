import { KeyValueInterface } from './key-value.interface';

export interface ConditionValueResInterface {
  result: KeyValueInterface[];
  total: number;
  message?: string;
}
