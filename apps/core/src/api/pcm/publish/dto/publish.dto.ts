import { IntersectionType } from '@nestjs/swagger';
import { IgnorePagingFilter, ListFilter } from 'apps/core/src/util/core/query';

export class PublishGetDto extends IntersectionType(
  IgnorePagingFilter,
  ListFilter,
) {}
