import { ApiProperty } from '@nestjs/swagger';
import { GSGuaranteeOrganization } from '@rahino/localdatabase/models';

export class GuaranteeAnonymousOrganizationResponseDto {
  @ApiProperty({
    type: 'object',
    properties: {
      organization: { type: 'object', description: 'Organization details' },
      totalRequestCount: { type: 'number', description: 'Total request count' },
      finishedRequestCount: {
        type: 'number',
        description: 'Finished request count',
      },
      averageScore: { type: 'number', description: 'Average survey score' },
    },
    description: 'Organization details with statistics',
  })
  result: {
    organization: GSGuaranteeOrganization;
    totalRequestCount: number;
    finishedRequestCount: number;
    averageScore: number;
  };
}
