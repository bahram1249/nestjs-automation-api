import { ApiProperty } from '@nestjs/swagger';

export class PaymentTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Payment Type ID' })
  id: number;

  @ApiProperty({ example: 'Credit Card', description: 'Payment type name' })
  name: string;
}
