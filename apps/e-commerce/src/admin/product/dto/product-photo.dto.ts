import { AutoMap } from 'automapper-classes';
import { IsNumber } from 'class-validator';

export class ProductPhotoDto {
  @AutoMap()
  @IsNumber()
  id: bigint;
}
