import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class SubmitFactorDetailDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;
}
