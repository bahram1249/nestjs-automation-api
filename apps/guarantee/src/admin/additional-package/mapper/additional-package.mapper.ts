import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { AdditionalPackageDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { GSAdditionalPackage } from '@rahino/localdatabase/models';

@Injectable()
export class AdditionalPackageProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        AdditionalPackageDto,
        GSAdditionalPackage,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
