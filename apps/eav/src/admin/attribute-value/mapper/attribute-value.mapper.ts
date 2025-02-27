import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { AttributeValueDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { EAVAttributeValue } from '@rahino/localdatabase/models';

@Injectable()
export class AttributeValueProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        AttributeValueDto,
        EAVAttributeValue,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
