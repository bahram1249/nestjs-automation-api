import { IsNumber, IsString } from 'class-validator';

export class SadadVerifyDto {
  @IsNumber()
  OrderId: number;

  @IsString()
  Token: string;
  @IsString()
  SwitchResCode: string;

  @IsNumber()
  ResCode: number;

  @IsString()
  HashedCardNo: string;

  @IsString()
  PrimaryAccNo: string;

  @IsString()
  CardHolderFullName: string;
}
