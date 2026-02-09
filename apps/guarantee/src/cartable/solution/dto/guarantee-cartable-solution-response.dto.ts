import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeCartableSolutionProvinceDto {
  @ApiProperty({ example: 1, description: 'Province ID' })
  id: number;

  @ApiProperty({ example: 'Tehran', description: 'Province name' })
  name: string;
}

export class GuaranteeCartableSolutionItemDto {
  @ApiProperty({ example: 1, description: 'Solution ID' })
  id: number;

  @ApiProperty({ example: 'Solution Title', description: 'Solution title' })
  title: string;

  @ApiProperty({ example: 100000, description: 'Solution fee' })
  fee: bigint;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Update date',
  })
  updatedAt: Date;

  @ApiProperty({
    example: 1,
    description: 'Province solution ID',
    required: false,
  })
  provinceSolutionId?: number;

  @ApiProperty({ example: 1, description: 'Province ID', required: false })
  provinceId?: number;
}

export class GuaranteeCartableSolutionListResponseDto {
  @ApiProperty({
    type: [GuaranteeCartableSolutionItemDto],
    description: 'List of solutions',
  })
  result: GuaranteeCartableSolutionItemDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}

export class GuaranteeCartableSolutionResponseDto {
  @ApiProperty({
    type: GuaranteeCartableSolutionItemDto,
    description: 'Solution details',
  })
  result: GuaranteeCartableSolutionItemDto;
}
