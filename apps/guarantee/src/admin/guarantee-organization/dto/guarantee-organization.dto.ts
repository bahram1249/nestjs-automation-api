import { UserDto } from '@rahino/coreDashboard/user/dto';
import { AddressDto } from '@rahino/guarantee/client/address/dto';
import { AutoMap } from 'automapper-classes';
import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

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

  @IsObject()
  public address: AddressDto;

  @IsObject()
  public user: UserDto;
}
