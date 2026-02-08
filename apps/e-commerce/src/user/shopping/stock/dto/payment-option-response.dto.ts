import { ApiProperty } from '@nestjs/swagger';

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
    type: [Object],
  })
  payments: any[];
}
