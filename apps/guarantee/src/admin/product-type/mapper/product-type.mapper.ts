import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { ProductTypeDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { GSProductType } from '@rahino/localdatabase/models';

@Injectable()
export class ProductTypeProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        ProductTypeDto,
        GSProductType,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
