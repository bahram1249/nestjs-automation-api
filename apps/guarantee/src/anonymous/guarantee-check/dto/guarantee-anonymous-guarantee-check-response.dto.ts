import { ApiProperty } from '@nestjs/swagger';
import { GSGuarantee } from '@rahino/localdatabase/models';

export class GuaranteeAnonymousGuaranteeCheckResponseDto {
  @ApiProperty({
    type: GSGuarantee,
    description: 'Guarantee details by serial number',
  })
  result: GSGuarantee;
}
