import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { GuaranteeOrganizationDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import {
  GSAddress,
  GSGuaranteeOrganization,
} from '@rahino/localdatabase/models';
import { AddressDto } from '@rahino/guarantee/client/address/dto';
import { OrganizationDto } from '@rahino/bpmn/modules/organization/dto';

@Injectable()
export class GuaranteeOrganizationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        GuaranteeOrganizationDto,
        GSGuaranteeOrganization,
        forMember((dest) => dest.id, ignore()),
      );

      createMap(
        mapper,
        AddressDto,
        GSAddress,
        forMember((dest) => dest.id, ignore()),
      );

      createMap(mapper, GSAddress, AddressDto);

      createMap(mapper, GuaranteeOrganizationDto, OrganizationDto);
    };
  }
}
