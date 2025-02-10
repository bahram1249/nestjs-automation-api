import { CheckConditionsDto } from '../../condition/dto';

export class ExecuteConditionDto {
  source: string;
  checkCondition: CheckConditionsDto;
}
