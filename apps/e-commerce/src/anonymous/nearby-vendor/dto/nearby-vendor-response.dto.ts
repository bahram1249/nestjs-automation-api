import { ApiProperty } from '@nestjs/swagger';
import { AttachmentResponseDto } from './attachment-response.dto';
import { ProvinceResponseDto } from './province-response.dto';
import { CityResponseDto } from './city-response.dto';

export class NearbyVendorResponseDto {
  @ApiProperty({ example: 1, description: 'Vendor ID' })
  id: number;

  @ApiProperty({ example: 'Vendor Name', description: 'Vendor name' })
  name: string;

  @ApiProperty({ example: 'vendor-slug', description: 'Vendor slug' })
  slug: string;

  @ApiProperty({
    example: '123 Main Street',
    description: 'Vendor address',
    required: false,
  })
  address?: string;

  @ApiProperty({ example: 1, description: 'Priority order', required: false })
  priorityOrder?: number;

  @ApiProperty({
    example: 'Vendor Title',
    description: 'Meta title',
    required: false,
  })
  metaTitle?: string;

  @ApiProperty({
    example: 'vendor,shop,store',
    description: 'Meta keywords',
    required: false,
  })
  metaKeywords?: string;

  @ApiProperty({
    example: 'Vendor description',
    description: 'Meta description',
    required: false,
  })
  metaDescription?: string;

  @ApiProperty({ example: 1, description: 'Province ID', required: false })
  provinceId?: number;

  @ApiProperty({ example: 1, description: 'City ID', required: false })
  cityId?: number;

  @ApiProperty({ example: '35.6892', description: 'Latitude', required: false })
  latitude?: string;

  @ApiProperty({
    example: '51.3890',
    description: 'Longitude',
    required: false,
  })
  longitude?: string;

  @ApiProperty({
    description: 'Vendor attachment/logo',
    required: false,
    type: AttachmentResponseDto,
  })
  attachment?: AttachmentResponseDto;

  @ApiProperty({
    description: 'Province information',
    required: false,
    type: ProvinceResponseDto,
  })
  province?: ProvinceResponseDto;

  @ApiProperty({
    description: 'City information',
    required: false,
    type: CityResponseDto,
  })
  city?: CityResponseDto;
}
