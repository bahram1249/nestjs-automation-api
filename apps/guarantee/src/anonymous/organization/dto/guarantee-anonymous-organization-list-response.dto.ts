import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeAnonymousOrganizationListItemDto {
  @ApiProperty({ type: Number, description: 'Organization ID' })
  id: number;

  @ApiProperty({ type: String, description: 'Organization name' })
  name: string;

  @ApiProperty({ type: String, description: 'Province name' })
  provinceName: string;

  @ApiProperty({ type: String, description: 'City name', nullable: true })
  cityName?: string;

  @ApiProperty({
    type: String,
    description: 'Organization code',
    nullable: true,
  })
  code: string | null;

  @ApiProperty({ type: String, description: 'Full name of the user' })
  fullName: string;

  @ApiProperty({ type: Number, description: 'Latitude coordinate' })
  latitude: number;

  @ApiProperty({ type: Number, description: 'Longitude coordinate' })
  longitude: number;
}

export class GuaranteeAnonymousOrganizationListResponseDto {
  @ApiProperty({
    type: [GuaranteeAnonymousOrganizationListItemDto],
    description: 'List of organizations',
  })
  result: GuaranteeAnonymousOrganizationListItemDto[];

  @ApiProperty({
    type: Number,
    description: 'Total count of organizations',
  })
  total: number;
}
