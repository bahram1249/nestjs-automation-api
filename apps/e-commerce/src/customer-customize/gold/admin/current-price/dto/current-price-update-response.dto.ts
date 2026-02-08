import { ApiProperty } from '@nestjs/swagger';

export class CurrentPriceUpdateResponseDto {
  @ApiProperty({
    example: 'ok',
    description: 'Update operation result',
  })
  result: string;
}
