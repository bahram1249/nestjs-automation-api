import { IntersectionType } from '@nestjs/swagger';
import { PeriodTypeFilter } from '../filter';
import { ListFilter } from 'apps/core/src/util/core/query';

export class PeriodTypeGetDto extends IntersectionType(
  PeriodTypeFilter,
  ListFilter,
) {}
