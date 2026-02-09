import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeReportRewardHistoryRewardRuleDto {
  @ApiProperty({ example: 1, description: 'Reward rule ID' })
  id: number;

  @ApiProperty({
    example: 'Reward Rule Title',
    description: 'Reward rule title',
  })
  title: string;

  @ApiProperty({ example: 1000, description: 'Reward amount' })
  rewardAmount: number;
}

export class GuaranteeReportRewardHistoryUserDto {
  @ApiProperty({ example: 'John', description: 'First name' })
  firstname: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  lastname: string;

  @ApiProperty({ example: 'johndoe', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email' })
  email: string;

  @ApiProperty({ example: '09123456789', description: 'Phone number' })
  phoneNumber: string;
}

export class GuaranteeReportRewardHistoryGuaranteeDto {
  @ApiProperty({ example: 1, description: 'Guarantee ID' })
  id: number;

  @ApiProperty({ example: 'ABC123', description: 'Serial number' })
  serialNumber: string;
}

export class GuaranteeReportRewardHistoryRewardGuaranteeDto {
  @ApiProperty({ example: 1, description: 'Reward guarantee ID' })
  id: number;

  @ApiProperty({ example: 'XYZ789', description: 'Serial number' })
  serialNumber: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Start date',
  })
  startDate: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'End date' })
  endDate: Date;
}

export class GuaranteeReportRewardHistoryUnitPriceDto {
  @ApiProperty({ example: 1, description: 'Unit price ID' })
  id: number;

  @ApiProperty({ example: 'Rial', description: 'Unit price title' })
  title: string;
}

export class GuaranteeReportRewardHistoryItemDto {
  @ApiProperty({ example: 1, description: 'Reward history ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Guarantee ID' })
  guaranteeId: number;

  @ApiProperty({ example: 1, description: 'Reward rule ID' })
  rewardRuleId: number;

  @ApiProperty({ example: 2, description: 'Reward guarantee ID' })
  rewardGuaranteeId: number;

  @ApiProperty({ example: 1, description: 'Unit price ID' })
  unitPriceId: number;

  @ApiProperty({
    example: 'ABC123',
    description: 'Original guarantee serial number',
  })
  originalGuaranteeSerialNumber: string;

  @ApiProperty({ example: 1000, description: 'Reward amount' })
  rewardAmount: number;

  @ApiProperty({
    example: '2024-01-15T00:00:00.000Z',
    description: 'Reward date',
  })
  rewardDate: Date;

  @ApiProperty({
    type: GuaranteeReportRewardHistoryRewardRuleDto,
    description: 'Reward rule details',
  })
  rewardRule: GuaranteeReportRewardHistoryRewardRuleDto;

  @ApiProperty({
    type: GuaranteeReportRewardHistoryUserDto,
    description: 'User details',
  })
  user: GuaranteeReportRewardHistoryUserDto;

  @ApiProperty({
    type: GuaranteeReportRewardHistoryGuaranteeDto,
    description: 'Guarantee details',
  })
  guarantee: GuaranteeReportRewardHistoryGuaranteeDto;

  @ApiProperty({
    type: GuaranteeReportRewardHistoryRewardGuaranteeDto,
    description: 'Reward guarantee details',
  })
  rewardGuarantee: GuaranteeReportRewardHistoryRewardGuaranteeDto;

  @ApiProperty({
    type: GuaranteeReportRewardHistoryUnitPriceDto,
    description: 'Unit price details',
  })
  unitPrice: GuaranteeReportRewardHistoryUnitPriceDto;
}

export class GuaranteeReportRewardHistoryListResponseDto {
  @ApiProperty({
    type: [GuaranteeReportRewardHistoryItemDto],
    description: 'List of reward history records',
  })
  result: GuaranteeReportRewardHistoryItemDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}
