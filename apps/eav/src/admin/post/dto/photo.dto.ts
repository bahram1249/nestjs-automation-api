import { AutoMap } from 'automapper-classes';
import { IsNumber } from 'class-validator';

export class PhotoDto {
  @AutoMap()
  @IsNumber()
  id: bigint;
}
