import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeCartableRequestTypeItemDto {
  @ApiProperty({ example: 1, description: 'Request Type ID' })
  id: number;

  @ApiProperty({
    example: 'Normal Guarantee',
    description: 'Request type title',
  })
  title: string;
}

export class GuaranteeCartableRequestTypeResponseDto {
  @ApiProperty({
    type: [GuaranteeCartableRequestTypeItemDto],
    description: 'List of request types',
  })
  result: GuaranteeCartableRequestTypeItemDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}
