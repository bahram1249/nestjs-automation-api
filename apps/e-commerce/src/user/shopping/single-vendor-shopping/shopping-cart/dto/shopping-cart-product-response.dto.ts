import { ApiProperty } from '@nestjs/swagger';
import { ProductResponseDto } from '@rahino/ecommerce/client/product/dto/product-response.dto';

export class ShoppingCartProductResponseDto {
  @ApiProperty({ example: 1, description: 'Shopping cart product ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Shopping cart ID' })
  shoppingCartId: bigint;

  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: bigint;

  @ApiProperty({ example: 1, description: 'Inventory ID' })
  inventoryId: bigint;

  @ApiProperty({ example: 2, description: 'Quantity' })
  qty: number;

  @ApiProperty({
    description: 'Product details',
    required: false,
    type: () => ProductResponseDto,
  })
  product?: ProductResponseDto;
}
