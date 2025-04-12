import { IsOptional, IsString } from 'class-validator';

export class SubmitFactorDetailDto {
  @IsOptional()
  @IsString()
  description?: string;
}
