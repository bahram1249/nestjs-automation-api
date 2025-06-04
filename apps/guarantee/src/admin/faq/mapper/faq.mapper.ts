import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { FaqDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { GSFaq } from '@rahino/localdatabase/models';

@Injectable()
export class FaqProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        FaqDto,
        GSFaq,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
