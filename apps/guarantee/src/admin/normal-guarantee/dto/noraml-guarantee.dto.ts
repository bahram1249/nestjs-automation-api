import { AutoMap } from 'automapper-classes';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class NoramlGuaranteeDto {
  @AutoMap()
  @IsOptional()
  @IsNumber()
  public providerId: number;

  @AutoMap()
  @IsNumber()
  public guaranteeTypeId: number;

  @AutoMap()
  @IsOptional()
  @IsNumber()
  public guaranteePeriodId: number;

  @AutoMap()
  @IsOptional()
  @IsNumber()
  public brandId: number;

  @AutoMap()
  @IsNumber()
  public guaranteeConfirmStatusId: number;

  @AutoMap()
  @IsString()
  @IsOptional()
  public prefixSerial: string;

  @AutoMap()
  @IsString()
  public serialNumber: string;

  @AutoMap()
  @IsDateString()
  public startDate: Date;

  @AutoMap()
  @IsDateString()
  public endDate: Date;

  @AutoMap()
  @IsOptional()
  @IsDateString()
  public allowedDateEnterProduct?: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  public variantName: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  public description: string;

  @AutoMap()
  @IsNumber()
  @IsOptional()
  public variantId?: number;

  @AutoMap()
  @IsNumber()
  public productTypeId: number;
}
