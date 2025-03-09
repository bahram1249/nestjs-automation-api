import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { OrganizationDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { BPMNOrganization } from '@rahino/localdatabase/models';

@Injectable()
export class OrganizationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        OrganizationDto,
        BPMNOrganization,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
