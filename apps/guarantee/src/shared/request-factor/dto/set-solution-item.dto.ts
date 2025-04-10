import { IsArray, IsOptional, IsString } from 'class-validator';

import { SolutionArrayDto } from './solution-array.dto';
import { PartArrayDto } from './part-array.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SetSolutionItemDto {
  @IsString()
  @IsOptional()
  public description?: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({ isArray: true, type: SolutionArrayDto, required: false })
  public solutionItems?: SolutionArrayDto[] = [];

  @IsArray()
  @IsOptional()
  @ApiProperty({ isArray: true, type: PartArrayDto, required: false })
  public partItems?: PartArrayDto[] = [];
}
