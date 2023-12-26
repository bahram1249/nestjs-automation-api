import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class ReserveMenuDto {
  @Transform(({ value }) => JSON.parse(value))
  @IsNumber()
  id: bigint;
  @Transform(({ value }) => JSON.parse(value))
  @IsNumber()
  count: number;
}
