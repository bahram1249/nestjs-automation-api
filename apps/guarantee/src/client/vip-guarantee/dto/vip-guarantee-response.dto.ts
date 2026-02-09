import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientVipGuaranteeVipBundleTypeResponseDto {
  @ApiProperty({ example: 1, description: 'VIP Bundle Type ID' })
  id: number;

  @ApiProperty({ example: '#FF0000', description: 'Card color' })
  cardColor?: string;
}

export class GuaranteeClientVipGuaranteeResponseDto {
  @ApiProperty({ example: 1, description: 'Guarantee ID' })
  id: bigint;

  @ApiProperty({ example: '123456789', description: 'Serial number' })
  serialNumber: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Start date',
  })
  startDate: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'End date' })
  endDate: Date;

  @ApiProperty({
    example: 1,
    description: 'VIP Bundle Type ID',
    required: false,
  })
  vipBundleTypeId?: number;

  @ApiProperty({
    example: 100000,
    description: 'Total credit',
    required: false,
  })
  totalCredit?: bigint;

  @ApiProperty({
    example: 50000,
    description: 'Available credit',
    required: false,
  })
  availableCredit?: bigint;

  @ApiProperty({
    type: () => GuaranteeClientVipGuaranteeVipBundleTypeResponseDto,
    description: 'VIP Bundle Type',
    required: false,
  })
  vipBundleType?: GuaranteeClientVipGuaranteeVipBundleTypeResponseDto;
}
