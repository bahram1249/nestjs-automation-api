import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { GuaranteeDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { ECGuarantee } from '@rahino/localdatabase/models';

@Injectable()
export class GuaranteeProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        GuaranteeDto,
        ECGuarantee,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
