import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeResponseDto {
  @ApiProperty({ example: 1, description: 'Guarantee ID' })
  id: number;

  @ApiProperty({
    example: 'Manufacturer Warranty',
    description: 'Guarantee name',
  })
  name: string;

  @ApiProperty({
    example: 'manufacturer-warranty',
    description: 'Guarantee slug',
    required: false,
  })
  slug?: string;
}
