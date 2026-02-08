import { ApiProperty } from '@nestjs/swagger';

export class StockCreateResponseDto {
  @ApiProperty({
    description: 'Result of stock creation job',
    type: Object,
  })
  result: any;
}
