import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from '@rahino/query-filter/types';
import { OnlyParentDto } from './only-parent.dto';

export class MenuGetDto extends IntersectionType(
  IgnorePagingFilter,
  ListFilter,
  OnlyParentDto,
) {}
