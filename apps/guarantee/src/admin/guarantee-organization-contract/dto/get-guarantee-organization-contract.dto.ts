import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { GetGuaranteeOrganizationContractRequiredFieldDto } from './get-guarantee-organization-contract-required-field.dto';

export class GetGuaranteeOrganizationContractDto extends IntersectionType(
  ListFilter,
  GetGuaranteeOrganizationContractRequiredFieldDto,
) {}
