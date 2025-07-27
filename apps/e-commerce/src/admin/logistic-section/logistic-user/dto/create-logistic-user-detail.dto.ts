import { IsNumber } from 'class-validator';

export class CreateLogisticUserDetailDto {
  @IsNumber()
  logisticId: bigint;
}
