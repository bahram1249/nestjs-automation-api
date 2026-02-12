import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeReportTechnicalPersonItemDto {
  @ApiProperty({ example: 1, description: 'Technical person ID' })
  id: bigint;

  @ApiProperty({ example: 'John', description: 'First name' })
  firstname: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  lastname: string;

  @ApiProperty({ example: 'johndoe', description: 'Username' })
  username: string;

  @ApiProperty({ example: '09123456789', description: 'Phone number' })
  phoneNumber: string;

  @ApiProperty({
    example: 'Organization Name',
    description: 'Organization name',
  })
  organization: string;
}

export class GuaranteeReportTechnicalPersonListResponseDto {
  @ApiProperty({
    type: [GuaranteeReportTechnicalPersonItemDto],
    description: 'List of technical persons',
  })
  result: GuaranteeReportTechnicalPersonItemDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}
