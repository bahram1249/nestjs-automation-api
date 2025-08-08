import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { LogisticSendingPeriodDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import {
  ECDiscount,
  ECLogisticSendingPeriod,
} from '@rahino/localdatabase/models';

@Injectable()
export class LogisticSendingPeriodProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        LogisticSendingPeriodDto,
        ECLogisticSendingPeriod,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
