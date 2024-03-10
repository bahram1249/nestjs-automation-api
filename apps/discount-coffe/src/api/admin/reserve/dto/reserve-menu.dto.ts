import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class ReserveMenuDto {
  @Transform(({ value }) => BigInt(value))
  @IsNumber()
  id: bigint;
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  count: number;
}
