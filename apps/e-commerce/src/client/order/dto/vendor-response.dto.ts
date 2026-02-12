import { ApiProperty } from '@nestjs/swagger';

export class ClientOrderVendorResponseDto {
  @ApiProperty({ example: 1, description: 'Vendor ID' })
  id: number;

  @ApiProperty({ example: 'Vendor Name', description: 'Vendor name' })
  name: string;

  @ApiProperty({
    example: 'vendor-slug',
    description: 'Vendor slug',
    required: false,
  })
  slug?: string;
}
