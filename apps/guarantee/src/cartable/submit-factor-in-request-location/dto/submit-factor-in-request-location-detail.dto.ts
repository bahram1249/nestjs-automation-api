import { IsOptional, IsString } from 'class-validator';

export class SubmitFactorInRequestLocationDetailDto {
  @IsOptional()
  @IsString()
  description?: string;
}
