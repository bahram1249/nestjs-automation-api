import { AutoMap } from 'automapper-classes';
import { IsNumber, IsString } from 'class-validator';

export class AdditionalPackageDto {
  @AutoMap()
  @IsString()
  public title: string;

  @AutoMap()
  @IsNumber()
  public price: bigint;
}
