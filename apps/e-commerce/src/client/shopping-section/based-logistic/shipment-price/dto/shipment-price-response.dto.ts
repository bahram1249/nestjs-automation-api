import { ApiProperty } from '@nestjs/swagger';
import { OrderShipmentwayEnum } from '@rahino/ecommerce/shared/enum';

export class ShipmentSelectionGroupResultDto {
  @ApiProperty({ example: 1, description: 'Logistic ID' })
  logisticId: number;

  @ApiProperty({ example: 1, description: 'Shipment way ID' })
  shipmentWayId: number;

  @ApiProperty({ enum: OrderShipmentwayEnum, description: 'Shipment way type' })
  shipmentWayType: OrderShipmentwayEnum;

  @ApiProperty({
    example: 1,
    description: 'Sending period ID',
    required: false,
  })
  sendingPeriodId?: number | null;

  @ApiProperty({ example: 1, description: 'Weekly period ID', required: false })
  weeklyPeriodId?: number | null;

  @ApiProperty({
    example: 1,
    description: 'Weekly period time ID',
    required: false,
  })
  weeklyPeriodTimeId?: number | null;

  @ApiProperty({
    example: 15000,
    description: 'Applied price after free/discount rules',
  })
  price: number;

  @ApiProperty({
    example: 20000,
    description: 'Base price before free/discount rules',
  })
  realShipmentPrice: number;
}

export class SelectionsShipmentPriceResultDto {
  @ApiProperty({
    type: () => [ShipmentSelectionGroupResultDto],
    description: 'Group results',
  })
  groups: ShipmentSelectionGroupResultDto[];

  @ApiProperty({ example: 30000, description: 'Total price' })
  totalPrice: number;

  @ApiProperty({ example: 40000, description: 'Total real shipment price' })
  totalRealShipmentPrice: number;
}
