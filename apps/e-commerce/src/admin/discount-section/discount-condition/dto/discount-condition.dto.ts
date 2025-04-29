import { AutoMap } from 'automapper-classes';
import { IsNumber } from 'class-validator';

export class DiscountConditionDto {
  @AutoMap()
  @IsNumber()
  discountId: bigint;

  @AutoMap()
  @IsNumber()
  conditionTypeId: number;

  @AutoMap()
  @IsNumber()
  conditionValue: bigint;
}
