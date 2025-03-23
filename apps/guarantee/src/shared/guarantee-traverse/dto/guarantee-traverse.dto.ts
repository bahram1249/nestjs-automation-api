import { IsNumber } from 'class-validator';

export class GuaranteeTraverseDto {
  @IsNumber()
  requestStateId: bigint;
  @IsNumber()
  requestId: bigint;
  @IsNumber()
  nodeId: number;
  @IsNumber()
  nodeCommandId: number;
}
