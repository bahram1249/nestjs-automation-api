import { ApiProperty } from '@nestjs/swagger';

export class StockCountResponseDto {
  @ApiProperty({ example: 5, description: 'Total count of stocks' })
  result: number;
}
