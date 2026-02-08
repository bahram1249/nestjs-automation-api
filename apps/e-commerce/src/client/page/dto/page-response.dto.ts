import { ApiProperty } from '@nestjs/swagger';

export class PageResponseDto {
  @ApiProperty({ example: 1, description: 'Page ID' })
  id: bigint;

  @ApiProperty({ example: 'About Us', description: 'Page title' })
  title: string;

  @ApiProperty({ example: 'about-us', description: 'Page slug' })
  slug: string;

  @ApiProperty({
    example: 'Page description content',
    description: 'Page description',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 'About Us - My Store',
    description: 'Meta title',
    required: false,
  })
  metaTitle?: string;

  @ApiProperty({
    example: 'Learn more about our company',
    description: 'Meta description',
    required: false,
  })
  metaDescription?: string;

  @ApiProperty({
    example: 'about, company, store',
    description: 'Meta keywords',
    required: false,
  })
  metaKeywords?: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Created at',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Updated at',
  })
  updatedAt: Date;
}
