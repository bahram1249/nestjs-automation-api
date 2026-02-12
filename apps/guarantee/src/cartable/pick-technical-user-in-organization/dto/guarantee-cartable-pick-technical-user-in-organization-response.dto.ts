import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeCartablePickTechnicalUserInOrganizationResponseDto {
  @ApiProperty({
    example: { message: 'success' },
    description: 'Response result containing success message',
  })
  result: {
    message: string;
  };
}
