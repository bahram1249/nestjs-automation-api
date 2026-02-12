import { ApiProperty } from '@nestjs/swagger';

export class OrderShipmentWayResponseDto {
  @ApiProperty({ example: 1, description: 'Order Shipment Way ID' })
  id: number;

  @ApiProperty({ example: 'Express', description: 'Shipment way name' })
  name: string;
}
