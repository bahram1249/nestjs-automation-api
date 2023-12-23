import { IsNumber } from 'class-validator';

export class ReserveMenuDto {
  @IsNumber()
  id: bigint;
  @IsNumber()
  count: number;
}
