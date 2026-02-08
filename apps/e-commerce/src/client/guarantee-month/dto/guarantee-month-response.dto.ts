import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeMonthResponseDto {
  @ApiProperty({ example: 1, description: 'Guarantee month ID' })
  id: number;

  @ApiProperty({ example: '12 Months', description: 'Guarantee month name' })
  name: string;

  @ApiProperty({ example: 12, description: 'Month count' })
  monthCount: number;
}
