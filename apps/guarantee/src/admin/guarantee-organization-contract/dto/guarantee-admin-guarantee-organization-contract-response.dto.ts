import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeAdminGuaranteeOrganizationContractBpmnOrganizationResponseDto {
  @ApiProperty({ example: 1, description: 'Organization ID' })
  id: number;

  @ApiProperty({
    example: 'Organization Name',
    description: 'Organization name',
  })
  name?: string;
}

export class GuaranteeAdminGuaranteeOrganizationContractResponseDto {
  @ApiProperty({ example: 1, description: 'Contract ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Organization ID' })
  organizationId: number;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Start date',
  })
  startDate: Date;

  @ApiProperty({ example: '2024-12-31T00:00:00.000Z', description: 'End date' })
  endDate: Date;

  @ApiProperty({ example: 10.5, description: 'Representative share' })
  representativeShare?: number;

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

  @ApiProperty({
    type: () =>
      GuaranteeAdminGuaranteeOrganizationContractBpmnOrganizationResponseDto,
    description: 'BPMN Organization',
    required: false,
  })
  bpmnOrganization?: GuaranteeAdminGuaranteeOrganizationContractBpmnOrganizationResponseDto;
}
