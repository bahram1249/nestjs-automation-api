import { ApiProperty } from '@nestjs/swagger';

export class ShippingWayResponseDto {
  @ApiProperty({ example: 1, description: 'Shipping way ID' })
  id: number;

  @ApiProperty({
    example: 'Standard Delivery',
    description: 'Shipping way title',
  })
  title: string;
}
