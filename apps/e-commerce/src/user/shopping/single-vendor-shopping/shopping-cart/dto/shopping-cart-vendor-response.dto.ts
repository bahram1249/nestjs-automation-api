import { ApiProperty } from '@nestjs/swagger';

export class ShoppingCartVendorResponseDto {
  @ApiProperty({ example: 1, description: 'Vendor ID' })
  id: number;

  @ApiProperty({ example: 'Vendor Name', description: 'Vendor title' })
  title: string;

  @ApiProperty({ example: '35.6892', description: 'Latitude' })
  latitude: string;

  @ApiProperty({ example: '51.3890', description: 'Longitude' })
  longitude: string;

  @ApiProperty({ example: 'vendor-slug', description: 'Vendor slug' })
  slug: string;
}
