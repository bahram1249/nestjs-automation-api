import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { PreRegistrationOrganizationDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import {
  GSAddress,
  GSPreRegistrationOrganization,
} from '@rahino/localdatabase/models';
import { AddressDto } from '@rahino/guarantee/client/address/dto';

@Injectable()
export class PreRegistrationOrganizationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        PreRegistrationOrganizationDto,
        GSPreRegistrationOrganization,
        forMember((dest) => dest.id, ignore()),
      );

      createMap(
        mapper,
        AddressDto,
        GSAddress,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
