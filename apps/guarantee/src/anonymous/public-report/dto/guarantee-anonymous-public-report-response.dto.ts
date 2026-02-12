import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeAnonymousPublicReportResponseDto {
  @ApiProperty({
    type: 'object',
    properties: {
      activeOrganizationCount: {
        type: 'number',
        description: 'Count of active organizations',
      },
      totalRequestCount: { type: 'number', description: 'Total request count' },
      guaranteeCount: { type: 'number', description: 'Total guarantee count' },
      userCount: { type: 'number', description: 'Total user count' },
    },
    description: 'Public report statistics',
  })
  result: {
    activeOrganizationCount: number;
    totalRequestCount: number;
    guaranteeCount: number;
    userCount: number;
  };
}
