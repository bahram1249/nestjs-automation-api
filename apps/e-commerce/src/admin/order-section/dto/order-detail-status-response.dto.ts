import { ApiProperty } from '@nestjs/swagger';

export class OrderDetailStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Order Detail Status ID' })
  id: number;

  @ApiProperty({ example: 'Waiting For Process', description: 'Status name' })
  name: string;
}
