import { ApiProperty } from '@nestjs/swagger';
import { VariationPriceResponseDto } from './variation-price-response.dto';
import { VendorCommissionTypeResponseDto } from './vendor-commission-type-response.dto';

export class VendorCommissionResponseDto {
  @ApiProperty({ example: 1, description: 'Commission ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Vendor ID' })
  vendorId: number;

  @ApiProperty({ example: 1, description: 'Variation Price ID' })
  variationPriceId: number;

  @ApiProperty({ example: 1, description: 'Commission Type ID' })
  commissionTypeId: number;

  @ApiProperty({ example: 10000, description: 'Commission Amount' })
  amount: bigint;

  @ApiProperty({
    type: () => VariationPriceResponseDto,
    description: 'Variation Price details',
    required: false,
  })
  variationPrice?: VariationPriceResponseDto;

  @ApiProperty({
    type: () => VendorCommissionTypeResponseDto,
    description: 'Commission Type details',
    required: false,
  })
  commissionType?: VendorCommissionTypeResponseDto;
}
