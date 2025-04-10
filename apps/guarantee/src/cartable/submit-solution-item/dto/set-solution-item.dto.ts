import { IsArray, IsOptional, IsString } from 'class-validator';

import { SolutionArrayDto } from './solution-array.dto';
import { PartArrayDto } from './part-array.dto';

export class SetSolutionItemDto {
  @IsString()
  @IsOptional()
  public description?: string;

  @IsArray()
  @IsOptional()
  public solutionItems?: SolutionArrayDto[] = [];

  @IsArray()
  @IsOptional()
  public partItems?: PartArrayDto[] = [];
}
