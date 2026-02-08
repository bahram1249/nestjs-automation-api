import { ApiProperty } from '@nestjs/swagger';
import { TorobProductDto } from './torob-product.dto';

export class TorobProductListResponseDto {
  @ApiProperty({
    type: TorobProductDto,
    isArray: true,
    description: 'List of products',
  })
  products: TorobProductDto[];

  @ApiProperty({
    example: 'https://api.example.com/v1/api/ecommerce/torob/products/page/2',
    description: 'Next page URL',
    required: false,
  })
  nextpage?: string;

  @ApiProperty({
    example: 'https://api.example.com/v1/api/ecommerce/torob/products/page/1',
    description: 'Previous page URL',
    required: false,
  })
  previewpage?: string;
}
