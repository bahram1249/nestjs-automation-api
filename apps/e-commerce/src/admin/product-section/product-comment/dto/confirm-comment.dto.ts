import { IsOptional, IsString } from 'class-validator';

export class ConfirmCommentDto {
  @IsString()
  @IsOptional()
  description?: string;
}
