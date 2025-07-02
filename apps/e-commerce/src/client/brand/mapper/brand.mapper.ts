import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { BrandDto } from '../dto';
import { ECBrand } from '@rahino/localdatabase/models';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';

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
        ECBrand,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
