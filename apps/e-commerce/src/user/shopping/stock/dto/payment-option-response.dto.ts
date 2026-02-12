import { ApiProperty } from '@nestjs/swagger';

export class PaymentOptionGatewayDto {
  @ApiProperty({ example: 1, description: 'Payment gateway ID' })
  id: number;

  @ApiProperty({ example: 'zarinpal', description: 'Payment gateway name' })
  name: string;

  @ApiProperty({
    example: 'https://example.com/payment-logo.png',
    description: 'Image URL for the payment gateway',
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the payment gateway is eligible',
  })
  eligibleCheck: boolean;

  @ApiProperty({
    example: 'Pay with Zarinpal',
    description: 'Title message for the payment gateway',
    required: false,
  })
  titleMessage?: string;

  @ApiProperty({
    example: 'Secure payment via Zarinpal',
    description: 'Description of the payment gateway',
    required: false,
  })
  description?: string;
}

export class PaymentOptionResponseDto {
  @ApiProperty({ example: 1, description: 'Variation price ID' })
  variationPriceId: number;

  @ApiProperty({ example: 'Standard', description: 'Variation price name' })
  variationPriceName: string;

  @ApiProperty({ example: 100000, description: 'Total product price' })
  totalProductPrice: number;

  @ApiProperty({ example: 10000, description: 'Total discount amount' })
  totalDiscount: number;

  @ApiProperty({
    example: 110000,
    description: 'Total price including shipment',
  })
  totalPrice: number;

  @ApiProperty({ example: 10000, description: 'Total shipment price' })
  totalShipmentPrice: number;

  @ApiProperty({ example: 1, description: 'Shipment type ID' })
  shipmentType: number;

  @ApiProperty({
    example: 'Standard Delivery',
    description: 'Shipment type name',
  })
  shipmentTypeName: string;

  @ApiProperty({
    description: 'Available payment gateways',
    type: () => [PaymentOptionGatewayDto],
  })
  payments: PaymentOptionGatewayDto[];
}
