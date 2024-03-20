import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class DiscountDto {
  @IsInt()
  @Type(() => Number)
  discountId: bigint;
}
