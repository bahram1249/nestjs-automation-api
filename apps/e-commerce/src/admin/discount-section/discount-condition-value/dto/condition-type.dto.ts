import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class ConditionTypeDto {
  @IsInt()
  @Type(() => Number)
  conditionTypeId: number;
}
