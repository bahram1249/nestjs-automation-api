import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientFactorItemDto {
  @ApiProperty({
    example: 'Item Title',
    description: 'Item title',
    required: false,
  })
  title?: string;

  @ApiProperty({ example: 100000, description: 'Item price' })
  price: bigint;

  @ApiProperty({ example: 1, description: 'Item quantity' })
  qty: number;
}

export class GuaranteeClientFactorTransactionDto {
  @ApiProperty({ example: 1, description: 'Transaction ID' })
  id: bigint;

  @ApiProperty({
    example: 'Gateway Title',
    description: 'Payment gateway title',
  })
  gatewayTitle: string;

  @ApiProperty({ example: 100000, description: 'Transaction price' })
  price: bigint;
}

export class GuaranteeClientFactorDto {
  @ApiProperty({ example: 1, description: 'Factor ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Factor type ID' })
  factorTypeId: number;

  @ApiProperty({ example: 1, description: 'Factor status ID' })
  factorStatusId: number;

  @ApiProperty({ example: 1, description: 'Request ID', required: false })
  requestId?: bigint;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Settlement date',
    required: false,
  })
  settlementDate?: Date;

  @ApiProperty({
    example: 1,
    description: 'Created by user ID',
    required: false,
  })
  createdByUserId?: bigint;

  @ApiProperty({
    example: 10000,
    description: 'Representative share of solution',
    required: false,
  })
  representativeShareOfSolution?: bigint;

  @ApiProperty({ example: 100000, description: 'Total price' })
  totalPrice: bigint;

  @ApiProperty({ example: 1, description: 'Unit price ID' })
  unitPriceId: number;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Created at',
  })
  createdAt: Date;

  @ApiProperty({
    type: [GuaranteeClientFactorItemDto],
    description: 'Factor items',
  })
  factorItems: GuaranteeClientFactorItemDto[];

  @ApiProperty({
    type: [GuaranteeClientFactorTransactionDto],
    description: 'Transactions',
  })
  transactions: GuaranteeClientFactorTransactionDto[];

  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  fullName: string;

  @ApiProperty({ example: '1234567890', description: 'National code' })
  nationalCode: string;

  @ApiProperty({ example: 1, description: 'User type ID' })
  userTypeId: number;

  @ApiProperty({ example: 'User Type Title', description: 'User type title' })
  userTypeTitle: string;
}

export class GuaranteeClientFactorListResponseDto {
  @ApiProperty({
    type: [GuaranteeClientFactorDto],
    description: 'List of factors',
  })
  result: GuaranteeClientFactorDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}

export class GuaranteeClientFactorSingleResponseDto {
  @ApiProperty({ type: GuaranteeClientFactorDto, description: 'Factor' })
  result: GuaranteeClientFactorDto;
}
