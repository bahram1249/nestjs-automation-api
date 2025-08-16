import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { LogisticWeeklyPeriodDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import {
  ECLogisticWeeklyPeriod,
  ECLogisticWeeklyPeriodTime,
} from '@rahino/localdatabase/models';
import { LogisticWeeklyPeriodTimeDto } from '../dto/logistic-weekly-period-time.dto';
import { LogisticWeeklyPeriodDetailDto } from '../dto/logistic-weekly-period-detail.dto';

@Injectable()
export class LogisticWeeklyPeriodProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, LogisticWeeklyPeriodDetailDto, ECLogisticWeeklyPeriod);
      createMap(
        mapper,
        LogisticWeeklyPeriodTimeDto,
        ECLogisticWeeklyPeriodTime,
      );
    };
  }
}
