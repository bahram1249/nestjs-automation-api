import { IsNumber, IsOptional, IsString } from 'class-validator';

export class OrganizationDto {
  @IsString()
  public name: string;

  @IsNumber()
  @IsOptional()
  public parentId?: number;
}
