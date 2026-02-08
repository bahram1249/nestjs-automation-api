import { ApiProperty } from '@nestjs/swagger';
import { PaymentOptionResponseDto } from './payment-option-response.dto';
import { StockResponseDto } from './stock-response.dto';

export class StockPriceResponseDto {
  @ApiProperty({
    description: 'Available payment options',
    type: [PaymentOptionResponseDto],
  })
  paymentOptions: PaymentOptionResponseDto[];

  @ApiProperty({
    description: 'Stock items',
    type: [StockResponseDto],
  })
  stocks: StockResponseDto[];

  @ApiProperty({
    example: 'SUMMER2024',
    description: 'Applied coupon code',
    required: false,
  })
  couponCode?: string;

  @ApiProperty({
    example: 1,
    description: 'Address ID',
    required: false,
  })
  addressId?: bigint;
}
