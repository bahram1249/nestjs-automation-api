import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientVariantProviderResponseDto {
  @ApiProperty({ example: 1, description: 'Provider ID' })
  id: number;

  @ApiProperty({ example: 'Provider Title', description: 'Provider title' })
  title: string;
}

export class GuaranteeClientVariantResponseDto {
  @ApiProperty({ example: 1, description: 'Variant ID' })
  id: number;

  @ApiProperty({ example: 'Variant Title', description: 'Variant title' })
  title: string;

  @ApiProperty({
    example: 'Variant description',
    description: 'Variant description',
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
    type: () => GuaranteeClientVariantProviderResponseDto,
    description: 'Provider',
    required: false,
  })
  provider?: GuaranteeClientVariantProviderResponseDto;
}

export class GuaranteeClientVariantListResponseDto {
  @ApiProperty({
    type: [GuaranteeClientVariantResponseDto],
    description: 'List of variants',
  })
  result: GuaranteeClientVariantResponseDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}
