import { IntersectionType } from '@nestjs/swagger';
import { GetCartableFilteDto } from '@rahino/guarantee/shared/cartable-filtering/dto/get-cartable-filter.dto';
import { ListFilter } from '@rahino/query-filter';

export class GetTrackingRequestExternalDto extends IntersectionType(
  ListFilter,
  GetCartableFilteDto,
) {}
