import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeCartableTransactionResponseDto {
  @ApiProperty({ example: 1, description: 'Transaction ID' })
  transactionId: bigint;

  @ApiProperty({
    example: 'Gateway Title',
    description: 'Payment gateway title',
  })
  paymentGatewayTitle: string;

  @ApiProperty({ example: 100000, description: 'Price in Rial' })
  price: number;

  @ApiProperty({ description: 'Transaction date' })
  transactionDate: Date;
}

export class GuaranteeCartableFactorResponseDto {
  @ApiProperty({ example: 1, description: 'Factor ID' })
  id: bigint;

  @ApiProperty({ example: 100000, description: 'Total price' })
  totalPrice: bigint;

  @ApiProperty({ example: 1, description: 'Factor status ID' })
  factorStatusId: number;

  @ApiProperty({ example: 1, description: 'Factor type ID' })
  factorTypeId: number;
}

export class GuaranteeCartableFactorServiceResponseDto {
  @ApiProperty({ example: 1, description: 'Factor service ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Factor ID' })
  factorId: bigint;

  @ApiProperty({ example: 1, description: 'Solution ID', nullable: true })
  solutionId?: number;

  @ApiProperty({
    example: 'Part Name',
    description: 'Part name',
    nullable: true,
  })
  partName?: string;

  @ApiProperty({ example: 1, description: 'Quantity' })
  qty: number;

  @ApiProperty({ example: 10000, description: 'Price' })
  price: bigint;
}

export class GuaranteeCartableFactorDetailAndAmountRemainingResponseDto {
  @ApiProperty({
    type: 'object',
    properties: {
      remainingAmount: { type: 'number', example: 50000 },
      transactions: { type: 'array', items: { type: 'object' } },
      partServices: { type: 'array', items: { type: 'object' } },
      solutionServices: { type: 'array', items: { type: 'object' } },
      isAvailableForOnlinePayment: { type: 'boolean', example: true },
      factor: { type: 'object' },
    },
    description: 'Factor detail and remaining amount information',
  })
  result: {
    remainingAmount: number;
    transactions: GuaranteeCartableTransactionResponseDto[];
    partServices: GuaranteeCartableFactorServiceResponseDto[];
    solutionServices: GuaranteeCartableFactorServiceResponseDto[];
    isAvailableForOnlinePayment: boolean;
    factor: GuaranteeCartableFactorResponseDto;
  };
}
