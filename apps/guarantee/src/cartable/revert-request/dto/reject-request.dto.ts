import { IsNumber } from 'class-validator';

export class RevertRequestDetailDto {
  @IsNumber()
  requestId: bigint;
}
