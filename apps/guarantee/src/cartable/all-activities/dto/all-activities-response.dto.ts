import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeCartableBPMNProcessResponseDto {
  @ApiProperty({ example: 1, description: 'Process ID' })
  id: number;

  @ApiProperty({ example: 'Guarantee Process', description: 'Process name' })
  name: string;
}

export class GuaranteeCartableActivityResponseDto {
  @ApiProperty({ example: 1, description: 'Activity ID' })
  id: number;

  @ApiProperty({ example: 'Start Activity', description: 'Activity name' })
  name: string;

  @ApiProperty({ example: 1, description: 'Process ID' })
  processId: number;

  @ApiProperty({
    type: GuaranteeCartableBPMNProcessResponseDto,
    description: 'Process details',
  })
  process?: GuaranteeCartableBPMNProcessResponseDto;
}

export class GuaranteeCartableAllActivitiesResponseDto {
  @ApiProperty({
    type: [GuaranteeCartableActivityResponseDto],
    description: 'List of activities',
  })
  result: GuaranteeCartableActivityResponseDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}
