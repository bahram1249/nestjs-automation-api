import { ApiProperty } from '@nestjs/swagger';

export class VendorResponseDto {
  @ApiProperty({ example: 1, description: 'Vendor ID' })
  id: number;

  @ApiProperty({ example: 'Vendor Name', description: 'Vendor name' })
  name: string;

  @ApiProperty({ example: 'vendor-slug', description: 'Vendor slug' })
  slug: string;
}
