import { AutoMap } from 'automapper-classes';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AmazingContentDto {
  @IsNotEmpty()
  @AutoMap()
  public title: string;

  @IsNumber()
  @AutoMap()
  public sortBy: number;
}
