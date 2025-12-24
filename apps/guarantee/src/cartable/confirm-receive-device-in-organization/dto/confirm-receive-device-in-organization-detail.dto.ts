import { RequestItemDto } from './request-item.dto';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AttachmentDto } from './attachment.dto';

export class ConfirmReceiveDeviceInOrganizationDetailDto {
  @IsOptional()
  @IsArray()
  items?: RequestItemDto[] = [];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[] = [];
}
