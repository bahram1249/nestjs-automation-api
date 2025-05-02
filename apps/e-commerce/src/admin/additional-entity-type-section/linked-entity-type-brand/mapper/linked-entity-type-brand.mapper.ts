import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { LinkedEntityTypeBrandDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { ECLinkedEntityTypeBrand, ECPage } from '@rahino/localdatabase/models';

@Injectable()
export class LinkedEntityTypeBrandProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        LinkedEntityTypeBrandDto,
        ECLinkedEntityTypeBrand,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
