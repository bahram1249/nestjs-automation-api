import { ApiProperty } from '@nestjs/swagger';

export class ShoppingCartPriceResponseDto {
  @ApiProperty({
    example: 110000,
    description: 'Total price including shipment',
  })
  totalPrice: number;

  @ApiProperty({ example: 10000, description: 'Total discount amount' })
  totalDiscount: number;

  @ApiProperty({ example: 100000, description: 'Total product price' })
  totalProductPrice: number;

  @ApiProperty({ example: 10000, description: 'Total shipment price' })
  totalShipmentPrice: number;

  @ApiProperty({ example: true, description: 'Whether processing is allowed' })
  allowProcess: boolean;
}
