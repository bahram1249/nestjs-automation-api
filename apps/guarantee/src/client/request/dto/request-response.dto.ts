import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientRequestRequestTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Request Type ID' })
  id: number;

  @ApiProperty({ example: 'Repair', description: 'Request type title' })
  title?: string;
}

export class GuaranteeClientRequestRequestCategoryResponseDto {
  @ApiProperty({ example: 1, description: 'Request Category ID' })
  id: number;

  @ApiProperty({
    example: 'Normal Guarantee',
    description: 'Request category title',
  })
  title?: string;
}

export class GuaranteeClientRequestBrandResponseDto {
  @ApiProperty({ example: 1, description: 'Brand ID' })
  id: number;

  @ApiProperty({ example: 'Brand Name', description: 'Brand name' })
  title?: string;
}

export class GuaranteeClientRequestProductTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Product Type ID' })
  id: number;

  @ApiProperty({ example: 'Product Type', description: 'Product type name' })
  title?: string;
}

export class GuaranteeClientRequestVariantResponseDto {
  @ApiProperty({ example: 1, description: 'Variant ID' })
  id: number;

  @ApiProperty({ example: 'Variant Name', description: 'Variant name' })
  title?: string;
}

export class GuaranteeClientRequestProvinceResponseDto {
  @ApiProperty({ example: 1, description: 'Province ID' })
  id: number;

  @ApiProperty({ example: 'Tehran', description: 'Province name' })
  name?: string;
}

export class GuaranteeClientRequestCityResponseDto {
  @ApiProperty({ example: 1, description: 'City ID' })
  id: number;

  @ApiProperty({ example: 'Tehran', description: 'City name' })
  name?: string;
}

export class GuaranteeClientRequestNeighborhoodResponseDto {
  @ApiProperty({ example: 1, description: 'Neighborhood ID' })
  id: number;

  @ApiProperty({
    example: 'Neighborhood Name',
    description: 'Neighborhood name',
  })
  name?: string;
}

export class GuaranteeClientRequestAddressResponseDto {
  @ApiProperty({ example: 1, description: 'Address ID' })
  id: bigint;

  @ApiProperty({
    example: 'Home',
    description: 'Address name',
    required: false,
  })
  name?: string;

  @ApiProperty({ example: '35.7219', description: 'Latitude', required: false })
  latitude?: string;

  @ApiProperty({
    example: '51.3347',
    description: 'Longitude',
    required: false,
  })
  longitude?: string;

  @ApiProperty({ example: 1, description: 'Province ID' })
  provinceId: number;

  @ApiProperty({ example: 1, description: 'City ID', required: false })
  cityId?: number;

  @ApiProperty({ example: 1, description: 'Neighborhood ID', required: false })
  neighborhoodId?: number;

  @ApiProperty({
    example: 'Main Street',
    description: 'Street',
    required: false,
  })
  street?: string;

  @ApiProperty({ example: 'Alley 1', description: 'Alley', required: false })
  alley?: string;

  @ApiProperty({ example: '10', description: 'Plaque', required: false })
  plaque?: string;

  @ApiProperty({ example: '2', description: 'Floor number', required: false })
  floorNumber?: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Postal code',
    required: false,
  })
  postalCode?: string;

  @ApiProperty({
    type: () => GuaranteeClientRequestProvinceResponseDto,
    description: 'Province',
    required: false,
  })
  province?: GuaranteeClientRequestProvinceResponseDto;

  @ApiProperty({
    type: () => GuaranteeClientRequestCityResponseDto,
    description: 'City',
    required: false,
  })
  city?: GuaranteeClientRequestCityResponseDto;

  @ApiProperty({
    type: () => GuaranteeClientRequestNeighborhoodResponseDto,
    description: 'Neighborhood',
    required: false,
  })
  neighborhood?: GuaranteeClientRequestNeighborhoodResponseDto;
}

export class GuaranteeClientRequestResponseDto {
  @ApiProperty({ example: 1, description: 'Request ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Request Type ID' })
  requestTypeId: number;

  @ApiProperty({ example: 1, description: 'Request Category ID' })
  requestCategoryId: number;

  @ApiProperty({ example: 1, description: 'Brand ID', required: false })
  brandId?: number;

  @ApiProperty({ example: 1, description: 'Variant ID', required: false })
  variantId?: number;

  @ApiProperty({ example: 1, description: 'Product Type ID', required: false })
  productTypeId?: number;

  @ApiProperty({ example: 1, description: 'User ID' })
  userId: bigint;

  @ApiProperty({ example: 1, description: 'Address ID' })
  addressId: bigint;

  @ApiProperty({
    example: '09123456789',
    description: 'Phone number',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    type: () => GuaranteeClientRequestRequestTypeResponseDto,
    description: 'Request type',
    required: false,
  })
  requestType?: GuaranteeClientRequestRequestTypeResponseDto;

  @ApiProperty({
    type: () => GuaranteeClientRequestRequestCategoryResponseDto,
    description: 'Request category',
    required: false,
  })
  requestCategory?: GuaranteeClientRequestRequestCategoryResponseDto;

  @ApiProperty({
    type: () => GuaranteeClientRequestBrandResponseDto,
    description: 'Brand',
    required: false,
  })
  brand?: GuaranteeClientRequestBrandResponseDto;

  @ApiProperty({
    type: () => GuaranteeClientRequestProductTypeResponseDto,
    description: 'Product type',
    required: false,
  })
  productType?: GuaranteeClientRequestProductTypeResponseDto;

  @ApiProperty({
    type: () => GuaranteeClientRequestVariantResponseDto,
    description: 'Variant',
    required: false,
  })
  variant?: GuaranteeClientRequestVariantResponseDto;

  @ApiProperty({
    type: () => GuaranteeClientRequestAddressResponseDto,
    description: 'Address',
    required: false,
  })
  address?: GuaranteeClientRequestAddressResponseDto;
}

export class GuaranteeClientRequestCreateResponseDto {
  @ApiProperty({ example: 1, description: 'Tracking code (Request ID)' })
  trackingCode: bigint;

  @ApiProperty({ example: 'Success', description: 'Message' })
  message: string;
}

export class GuaranteeClientRequestImageUploadResponseDto {
  @ApiProperty({ example: 1, description: 'Attachment ID' })
  id: number;

  @ApiProperty({ example: 'filename.jpg', description: 'File name' })
  fileName: string;
}
