import { ApiProperty } from '@nestjs/swagger';
import { ClientProductResponseDto } from '@rahino/ecommerce/client/product/dto/product-response.dto';

export class ProductFavoriteResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  userId: bigint;

  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: bigint;

  @ApiProperty({
    description: 'Product details',
    required: false,
    type: () => ClientProductResponseDto,
  })
  product?: ClientProductResponseDto;
}

export class ProductFavoriteStatusResponseDto {
  @ApiProperty({
    example: true,
    description: 'Whether product is in favorites',
  })
  result: boolean;
}

export class ProductFavoriteActionResponseDto {
  @ApiProperty({ example: 'ok', description: 'Action result' })
  result: string;
}
