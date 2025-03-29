import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { VipBundleTypeDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { GSVipBundleType } from '@rahino/localdatabase/models';

@Injectable()
export class VipBundleTypeProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        VipBundleTypeDto,
        GSVipBundleType,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
