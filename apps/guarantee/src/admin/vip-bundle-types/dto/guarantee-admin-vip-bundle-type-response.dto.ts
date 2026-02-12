import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeAdminVipBundleTypeResponseDto {
  @ApiProperty({ example: 1, description: 'VIP Bundle Type ID' })
  id: number;

  @ApiProperty({ example: 'VIP Bundle Title', description: 'Title' })
  title?: string;

  @ApiProperty({ example: 1000000, description: 'Price' })
  price?: number;

  @ApiProperty({ example: 50000, description: 'Fee' })
  fee?: number;

  @ApiProperty({ example: 12, description: 'Month period' })
  monthPeriod?: number;

  @ApiProperty({ example: '#FF0000', description: 'Card color' })
  cardColor?: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Created at',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Updated at',
  })
  updatedAt: Date;
}
