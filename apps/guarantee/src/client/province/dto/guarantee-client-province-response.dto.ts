import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientProvinceResponseDto {
  @ApiProperty({ example: 1, description: 'Province ID' })
  id: number;

  @ApiProperty({ example: 'Tehran', description: 'Province name' })
  name: string;

  @ApiProperty({ example: 'tehran', description: 'Province slug' })
  slug: string;
}

export class GuaranteeClientProvinceListResponseDto {
  @ApiProperty({
    type: [GuaranteeClientProvinceResponseDto],
    description: 'List of provinces',
  })
  result: GuaranteeClientProvinceResponseDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}
