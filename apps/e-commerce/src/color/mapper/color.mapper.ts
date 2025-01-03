import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { ColorDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { ECColor } from '@rahino/database';

@Injectable()
export class ColorProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        ColorDto,
        ECColor,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
