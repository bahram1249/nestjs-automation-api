import { RequestItemDto } from './request-item.dto';
import { IsArray, IsOptional } from 'class-validator';

export class ConfirmReceiveDeviceInOrganizationDetailDto {
  @IsOptional()
  @IsArray()
  items?: RequestItemDto[] = [];
}
