import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeCartableShippingWayItemDto {
  @ApiProperty({ example: 1, description: 'Shipping Way ID' })
  id: number;

  @ApiProperty({ example: 'Courier', description: 'Shipping way title' })
  title: string;

  @ApiProperty({ example: 'truck', description: 'Shipping way icon' })
  icon: string;
}

export class GuaranteeCartableShippingWayResponseDto {
  @ApiProperty({
    type: [GuaranteeCartableShippingWayItemDto],
    description: 'List of shipping ways',
  })
  result: GuaranteeCartableShippingWayItemDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}
