import { AutoMap } from 'automapper-classes';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
} from 'class-validator';

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
  @IsDateString()
  public validFrom?: string;

  @AutoMap()
  @IsOptional()
  @IsDateString()
  public validUntil?: string;

  @AutoMap()
  @IsBoolean()
  public isActive: boolean;

  @AutoMap()
  @IsOptional()
  @IsString()
  public description?: string;
}
