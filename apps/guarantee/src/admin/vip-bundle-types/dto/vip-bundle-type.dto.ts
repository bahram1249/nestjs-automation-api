import { AutoMap } from 'automapper-classes';
import { IsNumber, IsString } from 'class-validator';

export class VipBundleTypeDto {
  @AutoMap()
  @IsString()
  public title: string;

  @AutoMap()
  @IsNumber()
  public price: bigint;

  @AutoMap()
  @IsNumber()
  public fee: bigint;

  @AutoMap()
  @IsString()
  public cardColor: string;

  @AutoMap()
  @IsNumber()
  public monthPeriod: number;
}
