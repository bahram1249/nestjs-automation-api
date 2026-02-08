import { ApiProperty } from '@nestjs/swagger';
import { AddressResponseDto } from './address-response.dto';
import { VendorBasicResponseDto } from './vendor-basic-response.dto';

export class VendorAddressResponseDto {
  @ApiProperty({ example: 1, description: 'Vendor Address ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Vendor ID' })
  vendorId: number;

  @ApiProperty({ example: 1, description: 'Address ID' })
  addressId: bigint;

  @ApiProperty({ example: 1, description: 'User ID' })
  userId: bigint;

  @ApiProperty({ example: false, description: 'Is deleted', required: false })
  isDeleted?: boolean;

  @ApiProperty({
    type: AddressResponseDto,
    description: 'Address information',
    required: false,
  })
  address?: AddressResponseDto;

  @ApiProperty({
    type: VendorBasicResponseDto,
    description: 'Vendor information',
    required: false,
  })
  vendor?: VendorBasicResponseDto;
}
