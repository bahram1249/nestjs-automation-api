import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { AttributeDto, UpdateAttributeDto } from '../dto';
import { EAVAttribute } from '@rahino/localdatabase/models';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';

@Injectable()
export class AttributeProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        AttributeDto,
        EAVAttribute,
        forMember((dest) => dest.id, ignore()),
      );

      createMap(
        mapper,
        UpdateAttributeDto,
        EAVAttribute,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
