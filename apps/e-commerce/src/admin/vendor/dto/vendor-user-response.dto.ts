import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from './user-response.dto';

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
    type: () => UserResponseDto,
    description: 'User details',
    required: false,
  })
  user?: UserResponseDto;
}
