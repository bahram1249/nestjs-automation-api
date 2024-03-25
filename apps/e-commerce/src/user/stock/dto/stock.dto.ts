import { AutoMap } from 'automapper-classes';
import { IsNumber } from 'class-validator';

export class StockDto {
  @AutoMap()
  @IsNumber()
  inventoryId: bigint;
  @AutoMap()
  @IsNumber()
  qty: number;
}
