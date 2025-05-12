import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { SelectedProductDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { ECSelectedProduct } from '@rahino/localdatabase/models';

@Injectable()
export class SelectedProductProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        SelectedProductDto,
        ECSelectedProduct,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
