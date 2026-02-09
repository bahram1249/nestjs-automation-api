import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeCartableOrganizationItemDto {
  @ApiProperty({ example: 1, description: 'Organization ID' })
  id: bigint;

  @ApiProperty({
    example: 'Organization Name (Province)',
    description: 'Organization name with province',
  })
  name: string;
}

export class GuaranteeCartableOrganizationResponseDto {
  @ApiProperty({
    type: [GuaranteeCartableOrganizationItemDto],
    description: 'List of organizations',
  })
  result: GuaranteeCartableOrganizationItemDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}
