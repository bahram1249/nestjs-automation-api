import { IsNumber } from 'class-validator';

export class DiscountConditionDto {
  @IsNumber()
  discountId: bigint;

  @IsNumber()
  conditionTypeId: number;

  @IsNumber()
  conditionValue: bigint;
}
