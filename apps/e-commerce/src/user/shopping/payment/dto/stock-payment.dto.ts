import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class StockPaymentDto {
  @ApiProperty({
    required: true,
    type: Number,
    description: 'addressId',
  })
  @IsNumber()
  addressId: bigint;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    description: 'couponCode',
  })
  couponCode?: string;

  @ApiProperty({
    required: true,
    type: Number,
    description: 'paymentId',
  })
  @IsNumber()
  paymentId: number;

  @ApiProperty({
    required: true,
    type: Number,
    description: 'variationPriceId',
  })
  @IsNumber()
  variationPriceId: number;

  @ApiProperty({
    required: false,
    type: String,
    description: 'noteDescription',
  })
  @IsString()
  @IsOptional()
  noteDescription?: string;
}
