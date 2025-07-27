import { AutoMap } from 'automapper-classes';
import { IsNotEmpty, IsObject, MaxLength, MinLength } from 'class-validator';
import { LogisticUserDto } from '../../logistic-user-role-handler/dto/logistic-user.dto';

export class LogisticDto {
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @AutoMap()
  title: string;

  @IsObject()
  user: LogisticUserDto;
}
