import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientTransactionResponseDto {
  @ApiProperty({ example: 1, description: 'Transaction ID' })
  id: bigint;

  @ApiProperty({ example: 100000, description: 'Total price' })
  totalPrice: bigint;

  @ApiProperty({ example: 1, description: 'Transaction status ID' })
  transactionStatusId: number;

  @ApiProperty({ example: 1, description: 'Factor ID' })
  factorId: bigint;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Created at',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Updated at',
  })
  updatedAt: Date;
}
