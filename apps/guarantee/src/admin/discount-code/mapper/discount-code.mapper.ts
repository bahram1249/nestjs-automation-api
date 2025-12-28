import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { DiscountCodeDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { GSDiscountCode } from '@rahino/localdatabase/models';

@Injectable()
export class DiscountCodeProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        DiscountCodeDto,
        GSDiscountCode,
        forMember((dest) => dest.id, ignore()),
        forMember((dest) => dest.createdAt, ignore()),
        forMember((dest) => dest.updatedAt, ignore()),
      );
    };
  }
}
