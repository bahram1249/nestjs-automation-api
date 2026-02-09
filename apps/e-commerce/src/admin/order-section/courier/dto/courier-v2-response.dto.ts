import { ApiProperty } from '@nestjs/swagger';
import { AdminOrderUserResponseDto } from '../../dto';
import { AdminOrderVendorResponseDto } from '../../dto';

export class CourierV2ResponseDto {
  @ApiProperty({ example: 1, description: 'Courier ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'User ID' })
  userId: bigint;

  @ApiProperty({ example: 1, description: 'Vendor ID', required: false })
  vendorId?: number;

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
    type: () => AdminOrderUserResponseDto,
    description: 'User details',
    required: false,
  })
  user?: AdminOrderUserResponseDto;

  @ApiProperty({
    type: () => AdminOrderVendorResponseDto,
    description: 'Vendor details',
    required: false,
  })
  vendor?: AdminOrderVendorResponseDto;
}
