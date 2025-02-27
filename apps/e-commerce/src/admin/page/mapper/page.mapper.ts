import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { PageDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { ECPage } from '@rahino/localdatabase/models';

@Injectable()
export class PageProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        PageDto,
        ECPage,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
