import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientNormalGuaranteeBrandResponseDto {
  @ApiProperty({ example: 1, description: 'Brand ID' })
  id: number;

  @ApiProperty({ example: 'Brand Name', description: 'Brand name' })
  title?: string;
}

export class GuaranteeClientNormalGuaranteeProductTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Product Type ID' })
  id: number;

  @ApiProperty({ example: 'Product Type', description: 'Product type name' })
  title?: string;
}

export class GuaranteeClientNormalGuaranteeVariantResponseDto {
  @ApiProperty({ example: 1, description: 'Variant ID' })
  id: number;

  @ApiProperty({ example: 'Variant Name', description: 'Variant name' })
  title?: string;
}

export class GuaranteeClientNormalGuaranteePeriodResponseDto {
  @ApiProperty({ example: 1, description: 'Guarantee Period ID' })
  id: number;

  @ApiProperty({ example: '12 months', description: 'Guarantee period name' })
  title?: string;
}

export class GuaranteeClientNormalGuaranteeResponseDto {
  @ApiProperty({ example: 1, description: 'Guarantee ID' })
  id: bigint;

  @ApiProperty({ example: '123456789', description: 'Serial number' })
  serialNumber: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Start date',
  })
  startDate: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'End date' })
  endDate: Date;

  @ApiProperty({ example: 1, description: 'Variant ID', required: false })
  variantId?: number;

  @ApiProperty({ example: 1, description: 'Brand ID', required: false })
  brandId?: number;

  @ApiProperty({ example: 1, description: 'Product Type ID', required: false })
  productTypeId?: number;

  @ApiProperty({
    type: () => GuaranteeClientNormalGuaranteeBrandResponseDto,
    description: 'Brand',
    required: false,
  })
  brand?: GuaranteeClientNormalGuaranteeBrandResponseDto;

  @ApiProperty({
    type: () => GuaranteeClientNormalGuaranteeProductTypeResponseDto,
    description: 'Product type',
    required: false,
  })
  productType?: GuaranteeClientNormalGuaranteeProductTypeResponseDto;

  @ApiProperty({
    type: () => GuaranteeClientNormalGuaranteeVariantResponseDto,
    description: 'Variant',
    required: false,
  })
  variant?: GuaranteeClientNormalGuaranteeVariantResponseDto;

  @ApiProperty({
    type: () => GuaranteeClientNormalGuaranteePeriodResponseDto,
    description: 'Guarantee period',
    required: false,
  })
  guaranteePeriod?: GuaranteeClientNormalGuaranteePeriodResponseDto;
}
