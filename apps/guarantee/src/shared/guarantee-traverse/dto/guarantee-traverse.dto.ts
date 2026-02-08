import { IsBoolean, IsNumber } from 'class-validator';

export class GuaranteeTraverseDto {
  @IsNumber()
  requestStateId: number;
  @IsNumber()
  requestId: number;
  @IsNumber()
  nodeId: number;
  @IsNumber()
  nodeCommandId: number;

  @IsBoolean()
  public isClientSideCartable: boolean = false;
}
