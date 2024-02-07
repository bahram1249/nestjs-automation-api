import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { VendorDto, VendorUserDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { ECVendor } from '@rahino/database/models/ecommerce-eav/ec-vendor.entity';
import { User } from '@rahino/database/models/core/user.entity';

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
        VendorUserDto,
        User,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
