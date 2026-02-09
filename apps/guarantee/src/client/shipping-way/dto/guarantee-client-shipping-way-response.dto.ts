import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientShippingWayResponseDto {
  @ApiProperty({ example: 1, description: 'Shipping Way ID' })
  id: number;

  @ApiProperty({
    example: 'Shipping Way Title',
    description: 'Shipping way title',
  })
  title: string;

  @ApiProperty({ example: 'icon-name', description: 'Icon name' })
  icon: string;
}

export class GuaranteeClientShippingWayListResponseDto {
  @ApiProperty({
    type: [GuaranteeClientShippingWayResponseDto],
    description: 'List of shipping ways',
  })
  result: GuaranteeClientShippingWayResponseDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}
