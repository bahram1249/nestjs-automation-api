import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeAnonymousPreRegistrationOrganizationResponseDto {
  @ApiProperty({
    type: 'object',
    properties: {
      id: { type: 'number', description: 'Pre-registration organization ID' },
      message: { type: 'string', description: 'Success message' },
    },
    description: 'Pre-registration organization creation result',
  })
  result: {
    id: number;
    message: string;
  };
}
