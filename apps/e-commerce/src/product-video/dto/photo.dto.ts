import { AutoMap } from 'automapper-classes';
import { IsNumber } from 'class-validator';

export class VideoDto {
  @AutoMap()
  @IsNumber()
  id: bigint;
}
