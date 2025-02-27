import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { EntityTypeFactorDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { ECEntityTypeFactor } from '@rahino/localdatabase/models';

@Injectable()
export class EntityTypFactorProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        EntityTypeFactorDto,
        ECEntityTypeFactor,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
