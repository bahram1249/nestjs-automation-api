import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { LogisticDto, LogisticUserDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { ECVendor } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';

@Injectable()
export class LogisticProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        LogisticDto,
        ECVendor,
        forMember((dest) => dest.id, ignore()),
      );

      createMap(
        mapper,
        LogisticUserDto,
        User,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
