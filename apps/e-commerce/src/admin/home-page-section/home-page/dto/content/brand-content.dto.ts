import { AutoMap } from 'automapper-classes';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class BrandContentDto {
  @IsNotEmpty()
  @AutoMap()
  public title: string;
}
