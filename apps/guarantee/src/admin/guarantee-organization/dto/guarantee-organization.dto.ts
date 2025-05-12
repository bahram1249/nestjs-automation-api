import { AddressDto } from '@rahino/guarantee/client/address/dto';
import { AutoMap } from 'automapper-classes';
import {
  IsBoolean,
  IsDateString,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserDto } from './user.dto';

export class GuaranteeOrganizationDto {
  @AutoMap()
  @IsString()
  public name: string;

  @AutoMap()
  @IsOptional()
  @IsBoolean()
  public isNationwide?: boolean;

  @AutoMap()
  @IsOptional()
  @IsBoolean()
  public isOnlinePayment?: boolean;

  @AutoMap()
  @IsOptional()
  @IsDateString()
  public licenseDate?: Date;

  @AutoMap()
  @IsOptional()
  @IsString()
  public code?: string;

  @IsObject()
  public address: AddressDto;

  @IsObject()
  public user: UserDto;
}
