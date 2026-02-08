import { ApiProperty } from '@nestjs/swagger';

export class PersianDateMonthResponseDto {
  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Gregorian date',
  })
  gregorianDate: string;

  @ApiProperty({
    example: '140201',
    description: 'Persian year and month (YYYYMM)',
  })
  yearMonth: string;

  @ApiProperty({ example: 'فروردین', description: 'Persian month name' })
  persianMonthName: string;
}
