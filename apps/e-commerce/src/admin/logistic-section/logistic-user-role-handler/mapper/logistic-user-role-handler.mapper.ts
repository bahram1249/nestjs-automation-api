import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { User } from '@rahino/database';
import { LogisticUserDto } from '../dto';

@Injectable()
export class LogisticUserRoleHandlerProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        LogisticUserDto,
        User,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
