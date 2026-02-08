import { ApiProperty } from '@nestjs/swagger';

export class OrderStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Order status ID' })
  id: number;

  @ApiProperty({ example: 'Pending', description: 'Order status name' })
  name: string;
}
