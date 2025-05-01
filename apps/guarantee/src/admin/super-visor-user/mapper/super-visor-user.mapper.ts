import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { SuperVisorUserDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { User } from '@rahino/database';

@Injectable()
export class SuperVisorUserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        SuperVisorUserDto,
        User,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
