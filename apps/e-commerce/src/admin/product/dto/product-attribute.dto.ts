import { AutoMap } from 'automapper-classes';
import { IsNumber, IsString } from 'class-validator';

export class ProductAttributeDto {
  @AutoMap()
  @IsNumber()
  id: bigint;

  @AutoMap()
  // @IsNumber()
  @IsString({ each: true })
  val: string;
}
