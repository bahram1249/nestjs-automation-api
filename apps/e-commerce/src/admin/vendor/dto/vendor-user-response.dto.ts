import { ApiProperty } from '@nestjs/swagger';
import { AdminVendorUserResponseDto } from './user-response.dto';

export class VendorUserResponseDto {
  @ApiProperty({ example: 1, description: 'Vendor ID' })
  vendorId: number;

  @ApiProperty({ example: 1, description: 'User ID' })
  userId: bigint;

  @ApiProperty({
    example: true,
    description: 'Is default user',
    required: false,
  })
  isDefault?: boolean;

  @ApiProperty({
    type: () => AdminVendorUserResponseDto,
    description: 'User details',
    required: false,
  })
  user?: AdminVendorUserResponseDto;
}
