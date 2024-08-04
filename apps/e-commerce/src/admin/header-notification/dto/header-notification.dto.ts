import { AutoMap } from 'automapper-classes';
import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class HeaderNotificationDto {
  @MinLength(3)
  @MaxLength(2048)
  @IsOptional()
  @AutoMap()
  message?: string;
}
