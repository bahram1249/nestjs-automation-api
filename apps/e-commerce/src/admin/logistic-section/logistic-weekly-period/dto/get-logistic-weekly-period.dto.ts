import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber } from 'class-validator';

export class GetLogistiWeeklyPeriodDto {
  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    required: true,
    type: IsNumber,
    description: 'logisticSendingPeriodId',
  })
  logisticSendingPeriodId: number;
}
