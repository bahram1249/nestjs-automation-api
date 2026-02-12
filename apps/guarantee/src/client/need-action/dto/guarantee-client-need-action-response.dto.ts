import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientRequestTypeDto {
  @ApiProperty({ example: 1, description: 'Request type ID' })
  id: number;

  @ApiProperty({ example: 'Type Title', description: 'Request type title' })
  title: string;
}

export class GuaranteeClientRequestCategoryDto {
  @ApiProperty({ example: 1, description: 'Request category ID' })
  id: number;

  @ApiProperty({
    example: 'Category Title',
    description: 'Request category title',
  })
  title: string;
}

export class GuaranteeClientBrandDto {
  @ApiProperty({ example: 1, description: 'Brand ID' })
  id: number;

  @ApiProperty({ example: 'Brand Title', description: 'Brand title' })
  title: string;
}

export class GuaranteeClientVariantDto {
  @ApiProperty({ example: 1, description: 'Variant ID' })
  id: number;

  @ApiProperty({ example: 'Variant Title', description: 'Variant title' })
  title: string;
}

export class GuaranteeClientProductTypeDto {
  @ApiProperty({ example: 1, description: 'Product type ID' })
  id: number;

  @ApiProperty({
    example: 'Product Type Title',
    description: 'Product type title',
  })
  title: string;
}

export class GuaranteeClientUserDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'John', description: 'First name', required: false })
  firstname?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  lastname?: string;
}

export class GuaranteeClientGuaranteeDto {
  @ApiProperty({ example: 1, description: 'Guarantee ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Guarantee period ID' })
  guaranteePeriodId: number;

  @ApiProperty({ example: 'ABC123', description: 'Serial number' })
  serialNumber: string;
}

export class GuaranteeClientProvinceDto {
  @ApiProperty({ example: 1, description: 'Province ID' })
  id: number;

  @ApiProperty({ example: 'Tehran', description: 'Province name' })
  name: string;
}

export class GuaranteeClientCityDto {
  @ApiProperty({ example: 1, description: 'City ID' })
  id: number;

  @ApiProperty({ example: 'Tehran', description: 'City name' })
  name: string;
}

export class GuaranteeClientNeighborhoodDto {
  @ApiProperty({ example: 1, description: 'Neighborhood ID' })
  id: number;

  @ApiProperty({
    example: 'Neighborhood Name',
    description: 'Neighborhood name',
  })
  name: string;
}

export class GuaranteeClientAddressDto {
  @ApiProperty({ example: 1, description: 'Address ID' })
  id: number;

  @ApiProperty({ example: 'Home', description: 'Address name' })
  name: string;

  @ApiProperty({ example: 35.7, description: 'Latitude' })
  latitude: number;

  @ApiProperty({ example: 51.4, description: 'Longitude' })
  longitude: number;

  @ApiProperty({ example: 1, description: 'Province ID' })
  provinceId: number;

  @ApiProperty({ example: 1, description: 'City ID', required: false })
  cityId?: number;

  @ApiProperty({ example: 1, description: 'Neighborhood ID' })
  neighborhoodId: number;

  @ApiProperty({ example: 'Street Name', description: 'Street' })
  street: string;

  @ApiProperty({ example: 'Alley Name', description: 'Alley' })
  alley: string;

  @ApiProperty({ example: '123', description: 'Plaque number' })
  plaque: string;

  @ApiProperty({ example: '1', description: 'Floor number' })
  floorNumber: string;

  @ApiProperty({ example: '1234567890', description: 'Postal code' })
  postalCode: string;

  @ApiProperty({
    type: GuaranteeClientProvinceDto,
    description: 'Province',
    required: false,
  })
  province?: GuaranteeClientProvinceDto;

  @ApiProperty({
    type: GuaranteeClientCityDto,
    description: 'City',
    required: false,
  })
  city?: GuaranteeClientCityDto;

  @ApiProperty({
    type: GuaranteeClientNeighborhoodDto,
    description: 'Neighborhood',
    required: false,
  })
  neighborhood?: GuaranteeClientNeighborhoodDto;
}

export class GuaranteeClientRequestDto {
  @ApiProperty({ example: 1, description: 'Request ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Request type ID' })
  requestTypeId: number;

  @ApiProperty({ example: 1, description: 'Request category ID' })
  requestCategoryId: number;

  @ApiProperty({ example: 1, description: 'Brand ID' })
  brandId: number;

  @ApiProperty({ example: 1, description: 'Variant ID' })
  variantId: number;

  @ApiProperty({ example: 1, description: 'Product type ID' })
  productTypeId: number;

  @ApiProperty({ example: 1, description: 'User ID' })
  userId: number;

  @ApiProperty({ example: 1, description: 'Guarantee ID' })
  guaranteeId: number;

  @ApiProperty({ example: '09123456789', description: 'Phone number' })
  phoneNumber: string;

  @ApiProperty({ example: 1, description: 'Address ID' })
  addressId: number;

  @ApiProperty({
    type: GuaranteeClientRequestTypeDto,
    description: 'Request type',
    required: false,
  })
  requestType?: GuaranteeClientRequestTypeDto;

  @ApiProperty({
    type: GuaranteeClientRequestCategoryDto,
    description: 'Request category',
    required: false,
  })
  requestCategory?: GuaranteeClientRequestCategoryDto;

  @ApiProperty({
    type: GuaranteeClientBrandDto,
    description: 'Brand',
    required: false,
  })
  brand?: GuaranteeClientBrandDto;

  @ApiProperty({
    type: GuaranteeClientVariantDto,
    description: 'Variant',
    required: false,
  })
  variant?: GuaranteeClientVariantDto;

  @ApiProperty({
    type: GuaranteeClientProductTypeDto,
    description: 'Product type',
    required: false,
  })
  productType?: GuaranteeClientProductTypeDto;

  @ApiProperty({
    type: GuaranteeClientUserDto,
    description: 'User',
    required: false,
  })
  user?: GuaranteeClientUserDto;

  @ApiProperty({
    type: GuaranteeClientGuaranteeDto,
    description: 'Guarantee',
    required: false,
  })
  guarantee?: GuaranteeClientGuaranteeDto;

  @ApiProperty({
    type: GuaranteeClientAddressDto,
    description: 'Address',
    required: false,
  })
  address?: GuaranteeClientAddressDto;
}

export class GuaranteeClientActivityDto {
  @ApiProperty({ example: 1, description: 'Activity ID' })
  id: number;

  @ApiProperty({ example: 'Activity Name', description: 'Activity name' })
  name: string;
}

export class GuaranteeClientNodeCommandTypeDto {
  @ApiProperty({ example: 1, description: 'Node command type ID' })
  id: number;

  @ApiProperty({ example: 'Type Name', description: 'Node command type name' })
  name: string;

  @ApiProperty({ example: '#FF0000', description: 'Command color' })
  commandColor: string;
}

export class GuaranteeClientNodeCommandDto {
  @ApiProperty({ example: 1, description: 'Node command ID' })
  id: number;

  @ApiProperty({ example: 'Command Name', description: 'Node command name' })
  name: string;

  @ApiProperty({ example: 1, description: 'Node command type ID' })
  nodeCommandTypeId: number;

  @ApiProperty({ example: '/route', description: 'Route' })
  route: string;

  @ApiProperty({
    type: GuaranteeClientNodeCommandTypeDto,
    description: 'Node command type',
    required: false,
  })
  nodeCommandType?: GuaranteeClientNodeCommandTypeDto;
}

export class GuaranteeClientNodeDto {
  @ApiProperty({ example: 1, description: 'Node ID' })
  id: number;

  @ApiProperty({ example: true, description: 'Inject form flag' })
  injectForm: boolean;

  @ApiProperty({
    type: [GuaranteeClientNodeCommandDto],
    description: 'Node commands',
    required: false,
  })
  nodeCommands?: GuaranteeClientNodeCommandDto[];
}

export class GuaranteeClientNeedActionItemDto {
  @ApiProperty({ example: 1, description: 'Request state ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Request ID' })
  requestId: number;

  @ApiProperty({ example: 1, description: 'Activity ID' })
  activityId: number;

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
    type: GuaranteeClientActivityDto,
    description: 'Activity',
    required: false,
  })
  activity?: GuaranteeClientActivityDto;

  @ApiProperty({
    type: GuaranteeClientRequestDto,
    description: 'Guarantee request',
    required: false,
  })
  guaranteeRequest?: GuaranteeClientRequestDto;

  @ApiProperty({
    type: [GuaranteeClientNodeDto],
    description: 'Nodes',
    required: false,
  })
  nodes?: GuaranteeClientNodeDto[];
}

export class GuaranteeClientNeedActionListResponseDto {
  @ApiProperty({
    type: [GuaranteeClientNeedActionItemDto],
    description: 'List of need actions',
  })
  result: GuaranteeClientNeedActionItemDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}
