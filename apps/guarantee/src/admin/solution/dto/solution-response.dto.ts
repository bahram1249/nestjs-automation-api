import { ApiProperty } from '@nestjs/swagger';
import { GSProvince } from '@rahino/localdatabase/models';

export class GuaranteeAdminProvinceSolutionResponseDto {
  @ApiProperty({ example: 1, description: 'Province Solution ID' })
  id: number;

  @ApiProperty({ example: 100000, description: 'Fee amount' })
  fee: bigint;

  @ApiProperty({ example: 1, description: 'Province ID', required: false })
  provinceId?: number;

  @ApiProperty({
    type: () => GSProvince,
    description: 'Province',
    required: false,
  })
  province?: GSProvince;
}

export class GuaranteeAdminSolutionResponseDto {
  @ApiProperty({ example: 1, description: 'Solution ID' })
  id: number;

  @ApiProperty({
    example: 'Solution Title',
    description: 'Solution title',
    required: false,
  })
  title?: string;

  @ApiProperty({ example: 100000, description: 'Fee amount' })
  fee: bigint;

  @ApiProperty({
    type: () => [GuaranteeAdminProvinceSolutionResponseDto],
    description: 'Province solutions',
    required: false,
  })
  provinceSolutions?: GuaranteeAdminProvinceSolutionResponseDto[];

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
}
