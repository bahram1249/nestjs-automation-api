import { ApiProperty } from '@nestjs/swagger';

export class LogisticWeeklyPeriodTimeResponseDto {
  @ApiProperty({ example: 1, description: 'Weekly Period Time ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Logistic Weekly Period ID' })
  logisticWeeklyPeriodId: bigint;

  @ApiProperty({ example: 10, description: 'Capacity' })
  capacity: number;

  @ApiProperty({ example: '09:00', description: 'Start Time' })
  startTime: string;

  @ApiProperty({ example: '17:00', description: 'End Time' })
  endTime: string;
}

export class LogisticWeeklyPeriodResponseDto {
  @ApiProperty({ example: 1, description: 'Weekly Period ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Logistic Sending Period ID' })
  logisticSendingPeriodId: bigint;

  @ApiProperty({ example: 1, description: 'Week Number' })
  weekNumber: number;

  @ApiProperty({
    description: 'Weekly Period Times',
    type: () => LogisticWeeklyPeriodTimeResponseDto,
    isArray: true,
  })
  weeklyPeriodTimes?: LogisticWeeklyPeriodTimeResponseDto[];
}
