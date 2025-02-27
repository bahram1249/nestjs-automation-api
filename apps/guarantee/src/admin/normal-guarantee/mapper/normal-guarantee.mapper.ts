import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { NoramlGuaranteeDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { GSGuarantee } from '@rahino/localdatabase/models';

@Injectable()
export class NoramlGuaranteeProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        NoramlGuaranteeDto,
        GSGuarantee,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
