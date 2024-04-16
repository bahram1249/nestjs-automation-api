import { IsString } from 'class-validator';

export class SnapPayDto {
  @IsString()
  transactionId: string;
  @IsString()
  state: string;
  @IsString()
  amount: string;
}
