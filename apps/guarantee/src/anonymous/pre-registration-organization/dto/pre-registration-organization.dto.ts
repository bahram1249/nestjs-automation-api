import { UserDto } from '@rahino/coreDashboard/user/dto';
import { AddressDto } from '@rahino/guarantee/client/address/dto';
import { AutoMap } from 'automapper-classes';
import { IsDateString, IsNumber, IsObject, IsString } from 'class-validator';

export class PreRegistrationOrganizationDto {
  @AutoMap()
  @IsString()
  public title: string;

  @AutoMap()
  @IsString()
  public licenseCode: string;

  @AutoMap()
  @IsDateString()
  public licenseDate: Date;

  @AutoMap()
  @IsNumber()
  public licenseAttachmentId: bigint;

  @AutoMap()
  @IsNumber()
  public nationalAttachmentId: bigint;

  @AutoMap()
  @IsNumber()
  public estateAttachmentId: bigint;

  @AutoMap()
  @IsNumber()
  public postalAttachmentId: bigint;

  @IsObject()
  public address: AddressDto;

  @IsObject()
  public user: UserDto;
}
