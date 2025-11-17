import { IsOptional, IsString } from 'class-validator';

export class DescriptionDto {
  @IsOptional()
  @IsString()
  description: string;
}
