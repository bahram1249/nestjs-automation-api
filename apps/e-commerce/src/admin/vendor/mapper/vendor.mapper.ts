import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { VendorDto, VendorUserDto, VendorV2Dto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { ECVendor } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';

@Injectable()
export class VendorProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        VendorDto,
        ECVendor,
        forMember((dest) => dest.id, ignore()),
      );

      createMap(
        mapper,
        VendorV2Dto,
        ECVendor,
        forMember((dest) => dest.id, ignore()),
      );

      createMap(
        mapper,
        VendorUserDto,
        User,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
