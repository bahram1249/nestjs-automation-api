import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientBrandProviderResponseDto {
  @ApiProperty({ example: 1, description: 'Provider ID' })
  id: number;

  @ApiProperty({ example: 'Provider Title', description: 'Provider title' })
  title: string;
}

export class GuaranteeClientBrandResponseDto {
  @ApiProperty({ example: 1, description: 'Brand ID' })
  id: number;

  @ApiProperty({ example: 'Brand Title', description: 'Brand title' })
  title: string;

  @ApiProperty({
    example: 'Brand description',
    description: 'Brand description',
    required: false,
  })
  description?: string;

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

  @ApiProperty({
    type: () => GuaranteeClientBrandProviderResponseDto,
    description: 'Provider',
    required: false,
  })
  provider?: GuaranteeClientBrandProviderResponseDto;
}

export class GuaranteeClientBrandListResponseDto {
  @ApiProperty({
    type: [GuaranteeClientBrandResponseDto],
    description: 'List of brands',
  })
  result: GuaranteeClientBrandResponseDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}
