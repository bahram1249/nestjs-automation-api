import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class WalletPaymentDto {
  @ApiProperty({
    required: true,
    type: Number,
    description: 'amount',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    required: true,
    type: Number,
    description: 'paymentId',
  })
  @IsNumber()
  paymentId: number;
}
