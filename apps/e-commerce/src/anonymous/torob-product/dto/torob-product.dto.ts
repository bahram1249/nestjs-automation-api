import { ApiProperty } from '@nestjs/swagger';

export class TorobProductDto {
  @ApiProperty({ example: 'Product Title', description: 'Product title' })
  title: string;

  @ApiProperty({ example: 1, description: 'Product ID' })
  product_id: number;

  @ApiProperty({
    example: 'https://example.com/product/1',
    description: 'Product page URL',
  })
  page_url: string;

  @ApiProperty({ example: 100000, description: 'Product price' })
  price: number;

  @ApiProperty({
    example: 'instock',
    description: 'Product availability (instock or outofstock)',
  })
  availability: string;

  @ApiProperty({ example: 120000, description: 'Old price before discount' })
  old_price: number;
}
