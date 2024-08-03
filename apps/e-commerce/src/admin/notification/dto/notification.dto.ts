import { AutoMap } from 'automapper-classes';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class NotificationDto {
  @MinLength(3)
  @MaxLength(1024)
  @IsNotEmpty()
  @AutoMap()
  message: string;
}
