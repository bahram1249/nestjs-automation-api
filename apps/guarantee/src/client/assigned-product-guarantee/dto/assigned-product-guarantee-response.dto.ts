import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientAssignedProductGuaranteeProductTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Product Type ID' })
  id: number;

  @ApiProperty({ example: 'Product Type', description: 'Product type name' })
  title?: string;
}

export class GuaranteeClientAssignedProductGuaranteeBrandResponseDto {
  @ApiProperty({ example: 1, description: 'Brand ID' })
  id: number;

  @ApiProperty({ example: 'Brand Name', description: 'Brand name' })
  title?: string;
}

export class GuaranteeClientAssignedProductGuaranteeVariantResponseDto {
  @ApiProperty({ example: 1, description: 'Variant ID' })
  id: number;

  @ApiProperty({ example: 'Variant Name', description: 'Variant name' })
  title?: string;
}

export class GuaranteeClientAssignedProductGuaranteeResponseDto {
  @ApiProperty({ example: 1, description: 'Assigned Product Guarantee ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Product Type ID' })
  productTypeId: number;

  @ApiProperty({ example: 1, description: 'Brand ID' })
  brandId: number;

  @ApiProperty({ example: 1, description: 'Variant ID' })
  variantId: number;

  @ApiProperty({
    type: () => GuaranteeClientAssignedProductGuaranteeProductTypeResponseDto,
    description: 'Product type',
    required: false,
  })
  productType?: GuaranteeClientAssignedProductGuaranteeProductTypeResponseDto;

  @ApiProperty({
    type: () => GuaranteeClientAssignedProductGuaranteeBrandResponseDto,
    description: 'Brand',
    required: false,
  })
  brand?: GuaranteeClientAssignedProductGuaranteeBrandResponseDto;

  @ApiProperty({
    type: () => GuaranteeClientAssignedProductGuaranteeVariantResponseDto,
    description: 'Variant',
    required: false,
  })
  variant?: GuaranteeClientAssignedProductGuaranteeVariantResponseDto;
}
