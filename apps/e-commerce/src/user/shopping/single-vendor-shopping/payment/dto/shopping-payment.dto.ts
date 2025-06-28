import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SingleVendorShoppingPaymentDto {
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
    description: 'paymentGatewayId',
  })
  @IsNumber()
  paymentGatewayId: number;

  @ApiProperty({
    required: false,
    type: String,
    description: 'noteDescription',
  })
  @IsString()
  @IsOptional()
  noteDescription?: string;

  @ApiProperty({
    required: true,
    type: Number,
    description: 'shoppingCartId',
  })
  @IsNumber()
  shoppingCartId: bigint;
}
