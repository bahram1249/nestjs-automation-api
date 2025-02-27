import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { VaraintDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { GSBrand, GSVariant } from '@rahino/localdatabase/models';

@Injectable()
export class VariantProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        VaraintDto,
        GSVariant,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
