import { ApiProperty } from '@nestjs/swagger';

export class OrderShipmentWayResponseDto {
  @ApiProperty({ example: 1, description: 'Shipment Way ID' })
  id: number;

  @ApiProperty({ example: 'Post', description: 'Shipment way name' })
  name: string;

  @ApiProperty({ example: false, description: 'Is periodic', required: false })
  isPeriodic?: boolean;

  @ApiProperty({
    example: 'icon.png',
    description: 'Icon filename',
    required: false,
  })
  icon?: string;
}
