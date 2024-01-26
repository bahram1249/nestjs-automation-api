import { AutoMap } from 'automapper-classes';
import { IsNumber, IsString } from 'class-validator';

export class EntityAttributeValueDto {
  @AutoMap()
  @IsNumber()
  id: bigint;

  @AutoMap()
  // @IsNumber()
  @IsString({ each: true })
  val: string;
}
