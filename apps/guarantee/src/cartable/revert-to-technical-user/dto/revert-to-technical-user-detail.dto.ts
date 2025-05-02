import { IsOptional, IsString } from 'class-validator';

export class RevertToTechnicalUserDetailDto {
  @IsOptional()
  @IsString()
  description?: string;
}
