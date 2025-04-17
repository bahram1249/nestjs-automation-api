import { AutoMap } from 'automapper-classes';
import { IsDateString, IsOptional } from 'class-validator';

export class GetFactorDetailDto {
  @AutoMap()
  @IsDateString()
  @IsOptional()
  greaterThan?: Date;

  @AutoMap()
  @IsDateString()
  @IsOptional()
  lessThan?: Date;
}
