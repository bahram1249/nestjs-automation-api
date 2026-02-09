import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeAdminVipGeneratorVipBundleTypeResponseDto {
  @ApiProperty({ example: 1, description: 'VIP Bundle Type ID' })
  id: number;

  @ApiProperty({
    example: 'VIP Bundle Title',
    description: 'VIP bundle type title',
  })
  title?: string;

  @ApiProperty({ example: '#FF0000', description: 'Card color' })
  cardColor?: string;

  @ApiProperty({ example: 12, description: 'Month period' })
  monthPeriod?: number;
}

export class GuaranteeAdminVipGeneratorResponseDto {
  @ApiProperty({ example: 1, description: 'VIP Generator ID' })
  id: number;

  @ApiProperty({ example: 'Generator Title', description: 'Title' })
  title?: string;

  @ApiProperty({ example: 1000000, description: 'Price' })
  price?: number;

  @ApiProperty({ example: 50000, description: 'Fee' })
  fee?: number;

  @ApiProperty({ example: false, description: 'Is completed' })
  isCompleted?: boolean;

  @ApiProperty({ example: 100, description: 'Quantity' })
  qty?: number;

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

  @ApiProperty({
    type: () => GuaranteeAdminVipGeneratorVipBundleTypeResponseDto,
    description: 'VIP bundle type',
    required: false,
  })
  vipBundleType?: GuaranteeAdminVipGeneratorVipBundleTypeResponseDto;
}
