import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { InventoryDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { ECInventory } from '@rahino/localdatabase/models';

@Injectable()
export class InventoryProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        InventoryDto,
        ECInventory,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
