import { ApiProperty } from '@nestjs/swagger';

export class ProductFavoriteResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  userId: bigint;

  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: bigint;

  @ApiProperty({
    type: 'object',
    description: 'Product details',
    required: false,
  })
  product?: any;
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
