import { ApiProperty } from '@nestjs/swagger';

export class OrderShipmentWayResponseDto {
  @ApiProperty({ example: 1, description: 'Order shipment way ID' })
  id: number;

  @ApiProperty({ example: 'Standard', description: 'Order shipment way name' })
  name: string;

  @ApiProperty({
    example: 'icon-name',
    description: 'Icon name',
    required: false,
  })
  icon?: string;
}
