import { IsNumber } from 'class-validator';

export class updateAllProvincePriceDto {
  @IsNumber()
  price: bigint;
}
