import { ApiProperty } from '@nestjs/swagger';

export class VendorLogisticResponseDto {
  @ApiProperty({ example: 1, description: 'Vendor Logistic ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Vendor ID' })
  vendorId: number;

  @ApiProperty({ example: 1, description: 'Logistic ID' })
  logisticId: bigint;

  @ApiProperty({
    example: true,
    description: 'Is default logistic',
    required: false,
  })
  isDefault?: boolean;
}
