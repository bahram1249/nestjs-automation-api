import { AutoMap } from 'automapper-classes';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LogisticUserDto {
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @AutoMap()
  firstname: string;

  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @AutoMap()
  lastname: string;

  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @AutoMap()
  phoneNumber: string;
}
