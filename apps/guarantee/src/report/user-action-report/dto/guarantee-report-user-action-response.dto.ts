import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeReportUserActionFromUserDto {
  @ApiProperty({ example: 'John', description: 'First name' })
  firstname: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  lastname: string;
}

export class GuaranteeReportUserActionActivityDto {
  @ApiProperty({ example: 'Activity Name', description: 'Activity name' })
  name: string;
}

export class GuaranteeReportUserActionItemDto {
  @ApiProperty({ example: 1, description: 'From user ID' })
  fromUserId: number;

  @ApiProperty({ example: 1, description: 'From activity ID' })
  fromActivityId: number;

  @ApiProperty({ example: 2, description: 'To activity ID' })
  toActivityId: number;

  @ApiProperty({ example: 1, description: 'Node ID' })
  nodeId: number;

  @ApiProperty({ example: 5, description: 'Count of actions' })
  count: number;

  @ApiProperty({ type: [Number], description: 'List of request IDs' })
  requestIds: number[];

  @ApiProperty({
    type: GuaranteeReportUserActionFromUserDto,
    description: 'From user details',
  })
  fromUser: GuaranteeReportUserActionFromUserDto;

  @ApiProperty({
    type: GuaranteeReportUserActionActivityDto,
    description: 'From activity details',
  })
  fromActivity: GuaranteeReportUserActionActivityDto;

  @ApiProperty({
    type: GuaranteeReportUserActionActivityDto,
    description: 'To activity details',
  })
  toActivity: GuaranteeReportUserActionActivityDto;
}

export class GuaranteeReportUserActionListResponseDto {
  @ApiProperty({
    type: [GuaranteeReportUserActionItemDto],
    description: 'List of user action reports',
  })
  result: GuaranteeReportUserActionItemDto[];
}
