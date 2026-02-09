import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientProductTypeProviderResponseDto {
  @ApiProperty({ example: 1, description: 'Provider ID' })
  id: number;

  @ApiProperty({ example: 'Provider Title', description: 'Provider title' })
  title: string;
}

export class GuaranteeClientProductTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Product Type ID' })
  id: number;

  @ApiProperty({
    example: 'Product Type Title',
    description: 'Product type title',
  })
  title: string;

  @ApiProperty({
    example: 'Product type description',
    description: 'Product type description',
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
    type: () => GuaranteeClientProductTypeProviderResponseDto,
    description: 'Provider',
    required: false,
  })
  provider?: GuaranteeClientProductTypeProviderResponseDto;
}

export class GuaranteeClientProductTypeListResponseDto {
  @ApiProperty({
    type: [GuaranteeClientProductTypeResponseDto],
    description: 'List of product types',
  })
  result: GuaranteeClientProductTypeResponseDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}
