import { IntersectionType } from '@nestjs/swagger';
import { GuaranteeTraverseDto } from '@rahino/guarantee/shared/guarantee-traverse';
import { DescriptionDto } from './description-request.dto';
import { ConfirmReceiveDeviceInOrganizationDetailDto } from './confirm-receive-device-in-organization-detail.dto';

export class ConfirmRequestDto extends IntersectionType(
  GuaranteeTraverseDto,
  DescriptionDto,
  ConfirmReceiveDeviceInOrganizationDetailDto,
) {}
