import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { SupplierPersonDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { User } from '@rahino/database';

@Injectable()
export class SupplierPersonProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        SupplierPersonDto,
        User,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
