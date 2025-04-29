import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { DiscountConditionDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { ECDiscountCondition } from '@rahino/localdatabase/models';

@Injectable()
export class DiscountConditionProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        DiscountConditionDto,
        ECDiscountCondition,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
