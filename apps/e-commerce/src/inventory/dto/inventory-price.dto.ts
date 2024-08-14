import { IsNumber } from 'class-validator';

export class InventoryPriceDto {
  @IsNumber()
  variationPriceId: number;
  @IsNumber()
  price: bigint;
}
