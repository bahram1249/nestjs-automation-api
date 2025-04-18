import { IsNumber, IsString } from 'class-validator';

export class SadadVerifyOutputDto {
  @IsString()
  ResCode: string;

  @IsNumber()
  Amount: number;

  @IsString()
  RetrivalRefNo: string;

  @IsString()
  SystemTraceNo: string;

  @IsNumber()
  OrderId: number;
}
