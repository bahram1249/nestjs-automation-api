import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AttachmentDto {
  @ApiProperty()
  @IsNumber()
  attachmentId: number;
}
