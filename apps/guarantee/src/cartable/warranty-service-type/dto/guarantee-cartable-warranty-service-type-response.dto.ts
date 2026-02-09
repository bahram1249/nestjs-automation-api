import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeCartableWarrantyServiceTypeItemDto {
  @ApiProperty({ example: 1, description: 'Warranty Service Type ID' })
  id: number;

  @ApiProperty({
    example: 'Include Warranty',
    description: 'Warranty service type title',
  })
  title: string;
}

export class GuaranteeCartableWarrantyServiceTypeResponseDto {
  @ApiProperty({
    type: [GuaranteeCartableWarrantyServiceTypeItemDto],
    description: 'List of warranty service types',
  })
  result: GuaranteeCartableWarrantyServiceTypeItemDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}
