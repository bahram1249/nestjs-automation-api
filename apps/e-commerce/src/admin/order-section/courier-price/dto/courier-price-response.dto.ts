import { ApiProperty } from '@nestjs/swagger';

export class CourierPriceResponseDto {
  @ApiProperty({ example: 50000, description: 'Base courier price' })
  baseCourierPrice: number;

  @ApiProperty({ example: 10000, description: 'Courier price by kilometer' })
  courierPriceByKilometer: number;
}
