import { IntersectionType } from '@nestjs/swagger';
import { GetCartableDto } from './get-cartable-dto';
import { CartableCurrentStateFilteDto } from './current-state-filter.dto';
import { CartableActivityFilterDto } from './cartable-activity-filter.dto';
import { CartableTrackingRequestFilterDto } from './tracking-request-filter.dto';
import { IncludeNodeFilterDto } from './include-node-filter.dto';

export class CartableFindAllWithFilter extends IntersectionType(
  GetCartableDto,
  CartableCurrentStateFilteDto,
  CartableActivityFilterDto,
  CartableTrackingRequestFilterDto,
  IncludeNodeFilterDto,
) {}
