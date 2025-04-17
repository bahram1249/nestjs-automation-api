import { AutoMap } from 'automapper-classes';
import { IsNumber, IsString } from 'class-validator';

export class VipGeneratorDto {
  @AutoMap()
  @IsString()
  public title: string;

  @IsNumber()
  public vipBundleTypeId: number;

  @AutoMap()
  @IsNumber()
  public qty: number;
}
