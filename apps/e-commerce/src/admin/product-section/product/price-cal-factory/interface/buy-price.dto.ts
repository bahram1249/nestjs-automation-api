import { IsNumber } from 'class-validator';

export class BuyPriceDto {
  @IsNumber()
  buyPrice: bigint;
}
