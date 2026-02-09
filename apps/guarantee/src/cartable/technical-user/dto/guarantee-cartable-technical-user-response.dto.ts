import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeCartableTechnicalUserItemDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: bigint;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of technical user',
  })
  fullName: string;
}

export class GuaranteeCartableTechnicalUserResponseDto {
  @ApiProperty({
    type: [GuaranteeCartableTechnicalUserItemDto],
    description: 'List of technical users',
  })
  result: GuaranteeCartableTechnicalUserItemDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}
