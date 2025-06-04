import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { EntityTypeDto, EntityTypeV2Dto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { EAVEntityType } from '@rahino/localdatabase/models';

@Injectable()
export class EntityTypeProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        EntityTypeDto,
        EAVEntityType,
        forMember((dest) => dest.id, ignore()),
      );

      createMap(
        mapper,
        EntityTypeV2Dto,
        EAVEntityType,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
