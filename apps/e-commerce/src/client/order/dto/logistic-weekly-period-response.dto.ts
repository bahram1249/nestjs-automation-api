import { ApiProperty } from '@nestjs/swagger';

export class LogisticWeeklyPeriodResponseDto {
  @ApiProperty({ example: 1, description: 'Logistic weekly period ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Logistic sending period ID' })
  logisticSendingPeriodId: number;

  @ApiProperty({ example: 1, description: 'Week number' })
  weekNumber: number;
}
