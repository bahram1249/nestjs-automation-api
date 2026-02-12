import { ApiProperty } from '@nestjs/swagger';

export class LogisticWeeklyPeriodTimeResponseDto {
  @ApiProperty({ example: 1, description: 'Logistic weekly period time ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Logistic weekly period ID' })
  logisticWeeklyPeriodId: number;

  @ApiProperty({ example: '09:00', description: 'Start time', required: false })
  startTime?: string;

  @ApiProperty({ example: '17:00', description: 'End time', required: false })
  endTime?: string;
}
