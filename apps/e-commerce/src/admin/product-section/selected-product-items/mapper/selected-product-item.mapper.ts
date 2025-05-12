import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { SelectedProductItemDto } from '../dto';
import { Mapper, createMap } from 'automapper-core';
import { ECSelectedProductItem } from '@rahino/localdatabase/models';

@Injectable()
export class SelectedProductItemProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, SelectedProductItemDto, ECSelectedProductItem);
    };
  }
}
