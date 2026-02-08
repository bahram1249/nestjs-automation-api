import { ApiProperty } from '@nestjs/swagger';

export class OrderStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Order Status ID' })
  id: number;

  @ApiProperty({ example: 'Completed', description: 'Order status name' })
  name: string;
}
