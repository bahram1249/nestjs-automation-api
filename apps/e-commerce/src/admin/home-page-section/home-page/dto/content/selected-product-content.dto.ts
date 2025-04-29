import { AutoMap } from 'automapper-classes';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class SelectedProductContentDto {
  @IsNotEmpty()
  @AutoMap()
  public title: string;
}
