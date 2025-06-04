import { AutoMap } from 'automapper-classes';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FaqDto {
  @AutoMap()
  @IsString()
  public question: string;

  @AutoMap()
  @IsString()
  public answer: string;

  @AutoMap()
  @IsOptional()
  @IsNumber()
  public priority: number;
}
