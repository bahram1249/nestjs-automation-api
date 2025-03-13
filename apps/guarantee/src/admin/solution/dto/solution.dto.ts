import { AutoMap } from 'automapper-classes';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { ChildSolutionDto } from './child-solution.dto';

export class SolutionDto {
  @AutoMap()
  @IsString()
  public title: string;

  @AutoMap()
  @IsNumber()
  public fee: bigint;

  @AutoMap()
  @IsNumber()
  public provinceId: number;

  @IsOptional()
  @IsArray({ each: true })
  public provinceSolutions?: ChildSolutionDto[];
}
