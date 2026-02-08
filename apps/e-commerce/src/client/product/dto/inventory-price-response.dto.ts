import { ApiProperty } from '@nestjs/swagger';
import { VariationPriceResponseDto } from './variation-price-response.dto';

export class InventoryPriceResponseDto {
  @ApiProperty({ example: 1, description: 'Inventory price ID' })
  id: bigint;

  @ApiProperty({ example: 100000, description: 'Price value' })
  price: bigint;

  @ApiProperty({
    type: () => VariationPriceResponseDto,
    description: 'Variation price details',
    required: false,
  })
  variationPrice?: VariationPriceResponseDto;
}
