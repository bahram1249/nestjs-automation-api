import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeReportActivityToActivityDto {
  @ApiProperty({ example: 'Activity Name', description: 'To activity name' })
  name: string;
}

export class GuaranteeReportActivityItemDto {
  @ApiProperty({ example: 1, description: 'To activity ID' })
  toActivityId: number;

  @ApiProperty({ example: 5, description: 'Count of transitions' })
  count: number;

  @ApiProperty({ type: [Number], description: 'List of request IDs' })
  requestIds: number[];

  @ApiProperty({
    type: GuaranteeReportActivityToActivityDto,
    description: 'To activity details',
  })
  toActivity: GuaranteeReportActivityToActivityDto;
}

export class GuaranteeReportActivityListResponseDto {
  @ApiProperty({
    type: [GuaranteeReportActivityItemDto],
    description: 'List of activity reports',
  })
  result: GuaranteeReportActivityItemDto[];
}
