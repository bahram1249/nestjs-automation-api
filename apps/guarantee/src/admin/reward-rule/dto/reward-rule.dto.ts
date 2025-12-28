import { AutoMap } from 'automapper-classes';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RewardRuleDto {
  @AutoMap()
  @IsString()
  public title: string;

  @AutoMap()
  @IsNumber()
  public rewardAmount: bigint;

  @AutoMap()
  @IsOptional()
  @IsNumber()
  public vipBundleTypeId?: bigint;

  @AutoMap()
  @IsOptional()
  @IsNumber()
  public monthPeriod?: number;

  @AutoMap()
  @IsOptional()
  @Type(() => Date)
  @IsDateString()
  public validFrom?: Date;

  @AutoMap()
  @IsOptional()
  @Type(() => Date)
  @IsDateString()
  public validUntil?: Date;

  @AutoMap()
  @IsBoolean()
  public isActive: boolean;

  @AutoMap()
  @IsOptional()
  @IsString()
  public description?: string;
}
