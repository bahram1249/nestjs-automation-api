import { AutoMap } from 'automapper-classes';
import { IsString } from 'class-validator';

export class TechnicalPersonDto {
  @AutoMap()
  @IsString()
  public firstname: string;

  @AutoMap()
  @IsString()
  public lastname: string;

  @AutoMap()
  public phoneNumber: string;
}
