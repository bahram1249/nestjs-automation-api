import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { AttachmentDto } from './attachment.dto';

export class SubmitFactorInRequestLocationDetailDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;

  @IsOptional()
  @IsArray()
  attachments?: AttachmentDto[];
}
