import { ApiProperty } from '@nestjs/swagger';
import { ScheduleSendingTypeResponseDto } from './schedule-sending-type-response.dto';

export class LogisticSendingPeriodResponseDto {
  @ApiProperty({ example: 1, description: 'Logistic sending period ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Logistic shipment way ID' })
  logisticShipmentWayId: number;

  @ApiProperty({ example: 1, description: 'Schedule sending type ID' })
  scheduleSendingTypeId: number;

  @ApiProperty({
    example: '2024-01-01',
    description: 'Start date',
    required: false,
  })
  startDate?: Date;

  @ApiProperty({
    example: '2024-12-31',
    description: 'End date',
    required: false,
  })
  endDate?: Date;

  @ApiProperty({
    type: () => ScheduleSendingTypeResponseDto,
    description: 'Schedule sending type details',
    required: false,
  })
  scheduleSendingType?: ScheduleSendingTypeResponseDto;
}
