import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { DiscountDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { ECDiscount } from '@rahino/localdatabase/models';

@Injectable()
export class DiscountProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        DiscountDto,
        ECDiscount,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
