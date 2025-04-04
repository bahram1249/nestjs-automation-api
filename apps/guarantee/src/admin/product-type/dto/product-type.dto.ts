import { AutoMap } from 'automapper-classes';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductTypeDto {
  @AutoMap()
  @IsString()
  public title: string;

  // @AutoMap()
  // @IsOptional()
  // @IsNumber()
  // public providerId: number;

  @AutoMap()
  @IsBoolean()
  public mandatoryAttendance: boolean;

  @AutoMap()
  @IsString()
  @IsOptional()
  public description?: string;
}
