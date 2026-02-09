import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeAdminRewardRuleUnitPriceResponseDto {
  @ApiProperty({ example: 1, description: 'Unit Price ID' })
  id: number;

  @ApiProperty({ example: 'Toman', description: 'Unit price title' })
  title: string;
}

export class GuaranteeAdminRewardRuleResponseDto {
  @ApiProperty({ example: 1, description: 'Reward Rule ID' })
  id: bigint;

  @ApiProperty({ example: 'Reward Title', description: 'Reward rule title' })
  title: string;

  @ApiProperty({ example: 100000, description: 'Reward amount' })
  rewardAmount: bigint;

  @ApiProperty({ example: 1, description: 'Unit price ID' })
  unitPriceId: number;

  @ApiProperty({
    type: GuaranteeAdminRewardRuleUnitPriceResponseDto,
    description: 'Unit price',
    required: false,
  })
  unitPrice?: GuaranteeAdminRewardRuleUnitPriceResponseDto;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Valid from date',
    required: false,
  })
  validFrom?: Date;

  @ApiProperty({
    example: '2024-12-31T23:59:59.000Z',
    description: 'Valid until date',
    required: false,
  })
  validUntil?: Date;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;

  @ApiProperty({
    example: 'Description',
    description: 'Reward rule description',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Last update date',
  })
  updatedAt: Date;
}

export class GuaranteeAdminRewardRuleListResponseDto {
  @ApiProperty({
    type: [GuaranteeAdminRewardRuleResponseDto],
    description: 'List of reward rules',
  })
  result: GuaranteeAdminRewardRuleResponseDto[];

  @ApiProperty({ example: 100, description: 'Total count' })
  total: number;
}

export class GuaranteeAdminRewardRuleSingleResponseDto {
  @ApiProperty({
    type: GuaranteeAdminRewardRuleResponseDto,
    description: 'Reward rule',
  })
  result: GuaranteeAdminRewardRuleResponseDto;
}
