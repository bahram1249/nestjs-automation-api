import { AutoMap } from 'automapper-classes';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class VaraintDto {
  @AutoMap()
  @IsString()
  public title: string;

  @AutoMap()
  @IsOptional()
  @IsNumber()
  public providerId: number;

  @AutoMap()
  @IsString()
  @IsOptional()
  public description: string;
}
