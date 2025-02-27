import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { BrandDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { GSBrand } from '@rahino/localdatabase/models';

@Injectable()
export class BrandProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        BrandDto,
        GSBrand,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
