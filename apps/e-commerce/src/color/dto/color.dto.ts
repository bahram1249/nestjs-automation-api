import { AutoMap } from 'automapper-classes';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ColorDto {
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @AutoMap()
  name: string;

  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @AutoMap()
  hexCode: string;
}
