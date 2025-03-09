import { AutoMap } from 'automapper-classes';
import { IsString } from 'class-validator';

export class UserDto {
  @AutoMap()
  @IsString()
  firstname: string;
  @AutoMap()
  @IsString()
  lastname: string;
  @AutoMap()
  @IsString()
  phoneNumber: string;
}
