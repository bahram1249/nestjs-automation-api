import { CheckConditionsDto } from '../dto';

export interface ConditionServiceImp {
  check(dto: CheckConditionsDto): Promise<boolean>;
}
