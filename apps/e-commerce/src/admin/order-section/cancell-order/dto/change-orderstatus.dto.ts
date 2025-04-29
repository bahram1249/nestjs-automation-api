import { IsNumber } from 'class-validator';

export class ChangeOrderStatusDto {
  @IsNumber()
  orderStatusId: number;
}
