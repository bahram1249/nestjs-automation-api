import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { LogisticWeeklyPeriodDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import {
  ECLogisticWeeklyPeriod,
  ECLogisticWeeklyPeriodTime,
} from '@rahino/localdatabase/models';
import { LogisticWeeklyPeriodTimeDto } from '../dto/logistic-weekly-period-time.dto';

@Injectable()
export class LogisticWeeklyPeriodProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, LogisticWeeklyPeriodDto, ECLogisticWeeklyPeriod);
      createMap(
        mapper,
        LogisticWeeklyPeriodTimeDto,
        ECLogisticWeeklyPeriodTime,
      );
    };
  }
}
