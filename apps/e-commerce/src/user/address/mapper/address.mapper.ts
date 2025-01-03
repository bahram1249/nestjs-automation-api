import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { AddressDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { ECAddress } from '@rahino/database';

@Injectable()
export class AddressProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        AddressDto,
        ECAddress,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
