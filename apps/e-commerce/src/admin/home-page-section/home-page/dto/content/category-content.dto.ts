import { AutoMap } from 'automapper-classes';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CategoryContentDto {
  @IsNotEmpty()
  @AutoMap()
  public title: string;
}
