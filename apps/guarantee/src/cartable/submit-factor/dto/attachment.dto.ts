import { IsNumber } from 'class-validator';

export class AttachmentDto {
  @IsNumber()
  attachmentId: number;
}
