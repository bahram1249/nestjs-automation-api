import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetGuaranteeOrganizationContractRequiredFieldDto {
  @IsInt()
  @Type(() => Number)
  organizationId: number;
}
