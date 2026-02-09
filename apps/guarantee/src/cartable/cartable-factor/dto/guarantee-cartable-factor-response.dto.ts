import { ApiProperty } from '@nestjs/swagger';
import { GSFactorItemOutputDto } from '../../../shared/success-factor-query-builder/dto/factor-item.output';
import { GSFactorTransactionOutputDto } from '../../../shared/success-factor-query-builder/dto/factor-transactions.output';

export class GuaranteeCartableFactorItemDto {
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
    description: 'Creation date',
  })
  createdAt: Date;

  @ApiProperty({
    type: [GSFactorItemOutputDto],
    description: 'Factor items',
  })
  factorItems: GSFactorItemOutputDto[];

  @ApiProperty({
    type: [GSFactorTransactionOutputDto],
    description: 'Transactions',
  })
  transactions: GSFactorTransactionOutputDto[];

  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  fullName: string;

  @ApiProperty({ example: '1234567890', description: 'National code' })
  nationalCode: string;

  @ApiProperty({ example: 1, description: 'User type ID' })
  userTypeId: number;

  @ApiProperty({ example: 'Normal', description: 'User type title' })
  userTypeTitle: string;
}

export class GuaranteeCartableFactorListResponseDto {
  @ApiProperty({
    type: [GuaranteeCartableFactorItemDto],
    description: 'List of factors',
  })
  result: GuaranteeCartableFactorItemDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}

export class GuaranteeCartableFactorResponseDto {
  @ApiProperty({
    type: GuaranteeCartableFactorItemDto,
    description: 'Factor details',
  })
  result: GuaranteeCartableFactorItemDto;
}
