import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeReportIncomeItemDto {
  @ApiProperty({ example: 1, description: 'Factor ID' })
  id: bigint;

  @ApiProperty({ example: 10, description: 'Representative share percent' })
  representativeSharePercent: number;

  @ApiProperty({
    example: 1000,
    description: 'Sum of solution include warranty',
  })
  sumOfSolutionIncludeWarranty: number;

  @ApiProperty({ example: 500, description: 'Sum of solution out of warranty' })
  sumOfSolutionOutOfWarranty: number;

  @ApiProperty({ example: 800, description: 'Sum of part include warranty' })
  sumOfPartIncludeWarranty: number;

  @ApiProperty({ example: 400, description: 'Sum of part out of warranty' })
  sumOfPartOutOfWarranty: number;

  @ApiProperty({
    example: 200,
    description: 'At least pay from customer for out of warranty',
  })
  atLeastPayFromCustomerForOutOfWarranty: number;

  @ApiProperty({ example: 300, description: 'Given cash payment' })
  givenCashPayment: number;

  @ApiProperty({
    example: 100,
    description: 'Extra cash payment for unavailable VIP',
  })
  extraCashPaymentForUnavailableVip: number;

  @ApiProperty({ example: 500, description: 'Organization to company' })
  organizationToCompany: number;

  @ApiProperty({ example: 600, description: 'Company to organization' })
  companyToOrganization: number;

  @ApiProperty({ example: 1000, description: 'Sum of organization to company' })
  sumOfOrganizationToCompany: number;

  @ApiProperty({ example: 1200, description: 'Sum of company to organization' })
  sumOfCompanyToOrganization: number;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Settlement date',
  })
  settlementDate: Date;

  @ApiProperty({ example: 1, description: 'Request ID' })
  requestId: bigint;
}

export class GuaranteeReportIncomeListResponseDto {
  @ApiProperty({
    type: [GuaranteeReportIncomeItemDto],
    description: 'List of income records',
  })
  result: GuaranteeReportIncomeItemDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}

export class GuaranteeReportIncomeTotalResponseDto {
  @ApiProperty({
    example: 100,
    description: 'Total representative share percent',
  })
  representativeSharePercent: number;

  @ApiProperty({
    example: 10000,
    description: 'Total sum of solution include warranty',
  })
  sumOfSolutionIncludeWarranty: number;

  @ApiProperty({
    example: 5000,
    description: 'Total sum of solution out of warranty',
  })
  sumOfSolutionOutOfWarranty: number;

  @ApiProperty({
    example: 8000,
    description: 'Total sum of part include warranty',
  })
  sumOfPartIncludeWarranty: number;

  @ApiProperty({
    example: 4000,
    description: 'Total sum of part out of warranty',
  })
  sumOfPartOutOfWarranty: number;

  @ApiProperty({
    example: 2000,
    description: 'Total at least pay from customer for out of warranty',
  })
  atLeastPayFromCustomerForOutOfWarranty: number;

  @ApiProperty({ example: 3000, description: 'Total given cash payment' })
  givenCashPayment: number;

  @ApiProperty({
    example: 1000,
    description: 'Total extra cash payment for unavailable VIP',
  })
  extraCashPaymentForUnavailableVip: number;

  @ApiProperty({ example: 5000, description: 'Total organization to company' })
  organizationToCompany: number;

  @ApiProperty({ example: 6000, description: 'Total company to organization' })
  companyToOrganization: number;

  @ApiProperty({
    example: 10000,
    description: 'Total sum of organization to company',
  })
  sumOfOrganizationToCompany: number;

  @ApiProperty({
    example: 12000,
    description: 'Total sum of company to organization',
  })
  sumOfCompanyToOrganization: number;
}

export class GuaranteeReportIncomeTotalWrapperResponseDto {
  @ApiProperty({
    type: GuaranteeReportIncomeTotalResponseDto,
    description: 'Total income summary',
  })
  result: GuaranteeReportIncomeTotalResponseDto;
}
