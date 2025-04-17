import { IsNumber, IsString } from 'class-validator';

export class SadadVerifyOutputDto {
  @IsNumber()
  ResCode: number;

  @IsNumber()
  Amount: number;

  @IsString()
  RetrivalRefNo: string;

  @IsString()
  SystemTraceNo: string;

  @IsNumber()
  OrderId: number;
}
