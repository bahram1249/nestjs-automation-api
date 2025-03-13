import { AutoMap } from 'automapper-classes';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class ChildSolutionDto {
  @AutoMap()
  @IsNumber()
  public fee: bigint;

  @AutoMap()
  @IsNumber()
  public provinceId: number;
}
