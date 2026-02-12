import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientPickShipmentWayResponseDto {
  @ApiProperty({ type: Object, description: 'Response message' })
  result: {
    message: string;
  };
}
