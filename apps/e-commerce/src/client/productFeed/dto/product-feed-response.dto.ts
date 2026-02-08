import { ApiProperty } from '@nestjs/swagger';

export class ProductFeedResponseDto {
  @ApiProperty({ example: '123', description: 'Product ID' })
  id: string;

  @ApiProperty({ example: 'Product Title', description: 'Product title' })
  title: string;

  @ApiProperty({ example: 'Product Title', description: 'Product subtitle' })
  subtitle: string;

  @ApiProperty({ example: 'product-slug', description: 'Product slug' })
  slug: string;

  @ApiProperty({
    example: 'https://example.com/product/123/slug',
    description: 'Product link',
  })
  link: string;

  @ApiProperty({
    example: ['https://example.com/image1.jpg'],
    description: 'Product image URLs',
    type: [String],
  })
  imageLink: string[];

  @ApiProperty({ example: 'in stock', description: 'Availability status' })
  availability: string;

  @ApiProperty({ example: 100000, description: 'Regular price' })
  regular_price: number;

  @ApiProperty({
    example: 'Brand Name',
    description: 'Brand name',
    required: false,
  })
  brand?: string;

  @ApiProperty({
    example: 'Category Name',
    description: 'Category name',
    required: false,
  })
  category?: string;

  @ApiProperty({ example: 90000, description: 'Sale price after discount' })
  sale_price: number;

  @ApiProperty({ example: {}, description: 'Product description' })
  description: object;
}
