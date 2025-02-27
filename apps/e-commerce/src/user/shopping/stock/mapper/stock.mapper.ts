import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { StockDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { ECStock } from '@rahino/localdatabase/models';

@Injectable()
export class StockProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        StockDto,
        ECStock,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
