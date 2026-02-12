import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientHistoryItemDto {
  @ApiProperty({ example: 1, description: 'History ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Request ID' })
  requestId: bigint;

  @ApiProperty({
    example: 'From State (User - Role - Organization)',
    description: 'From state information',
  })
  from: string;

  @ApiProperty({
    example: 'To State (User - Role - Organization)',
    description: 'To state information',
  })
  to: string;

  @ApiProperty({
    example: 'Description',
    description: 'History description',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 'Command Name',
    description: 'Node command name',
    required: false,
  })
  nodeCommand?: string;

  @ApiProperty({
    example: '#FF0000',
    description: 'Node command color',
    required: false,
  })
  nodeCommandColor?: string;

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

export class GuaranteeClientLatestRequestHistoryDto {
  @ApiProperty({ example: 1, description: 'Request ID', nullable: true })
  requestId: bigint | null;

  @ApiProperty({
    type: [GuaranteeClientHistoryItemDto],
    description: 'List of histories',
  })
  histories: GuaranteeClientHistoryItemDto[];
}

export class GuaranteeClientHistoryListResponseDto {
  @ApiProperty({
    type: [GuaranteeClientHistoryItemDto],
    description: 'List of histories',
  })
  result: GuaranteeClientHistoryItemDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}

export class GuaranteeClientLatestHistoryResponseDto {
  @ApiProperty({
    type: GuaranteeClientLatestRequestHistoryDto,
    description: 'Latest request with histories',
  })
  result: GuaranteeClientLatestRequestHistoryDto;

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}
