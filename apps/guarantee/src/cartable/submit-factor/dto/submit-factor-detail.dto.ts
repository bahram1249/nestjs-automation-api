import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { AttachmentDto } from './attachment.dto';

export class SubmitFactorDetailDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;

  @IsArray()
  attachments: AttachmentDto[] = [];
}
