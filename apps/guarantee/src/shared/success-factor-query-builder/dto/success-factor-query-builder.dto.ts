import { IntersectionType } from '@nestjs/swagger';
import { ListFilter } from '@rahino/query-filter';
import { GSSuccessFactorQueryBuilderDetailDto } from './success-factor-query-builder-detail.dto';

export class GSSuccessFactorQueryBuilderDto extends IntersectionType(
  ListFilter,
  GSSuccessFactorQueryBuilderDetailDto,
) {}
