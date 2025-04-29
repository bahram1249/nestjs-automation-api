import { IsOptional, IsString } from 'class-validator';

export class PostProcessDto {
  @IsString()
  @IsOptional()
  postReceipt?: string;
}
