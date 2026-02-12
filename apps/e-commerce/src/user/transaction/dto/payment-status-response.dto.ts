import { ApiProperty } from '@nestjs/swagger';

export class PaymentStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Payment Status ID' })
  id: number;

  @ApiProperty({ example: 'Completed', description: 'Payment status name' })
  name: string;
}
