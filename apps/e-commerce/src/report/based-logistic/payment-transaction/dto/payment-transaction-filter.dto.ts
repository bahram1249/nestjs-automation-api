import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, IsBigInt } from 'class-validator';

export class PaymentTransactionFilterDto {
  @ApiProperty({
    required: true,
    type: String,
    description: 'beginDate',
  })
  @IsString()
  beginDate: string;

  @ApiProperty({
    required: true,
    type: String,
    description: 'endDate',
  })
  @IsString()
  endDate: string;

  @ApiProperty({
    required: false,
    type: Number,
    description: 'paymentGatewayId',
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  paymentGatewayId?: number;

  @ApiProperty({
    required: false,
    type: BigInt,
    description: 'orderId',
  })
  @IsBigInt()
  @Type(() => BigInt)
  @IsOptional()
  orderId?: bigint;
}
