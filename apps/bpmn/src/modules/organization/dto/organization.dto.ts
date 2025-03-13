import { AutoMap } from 'automapper-classes';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class OrganizationDto {
  @AutoMap()
  @IsString()
  public name: string;

  @AutoMap()
  @IsNumber()
  @IsOptional()
  public parentId?: number;
}
