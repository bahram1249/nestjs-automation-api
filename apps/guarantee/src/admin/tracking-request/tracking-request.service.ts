import { Injectable } from '@nestjs/common';
import { GetCartableDto } from '../../shared/cartable-filtering/dto';
import * as _ from 'lodash';
import { User } from '@rahino/database';
import { SharedCartableFilteringService } from '@rahino/guarantee/shared/cartable-filtering/cartable-filtering.service';
import { GetTrackingRequestExternalDto } from './dto';

@Injectable()
export class TrackingRequestService {
  constructor(
    private readonly sharedCartableFilteringService: SharedCartableFilteringService,
  ) {}

  async findAll(user: User, filter: GetTrackingRequestExternalDto) {
    const customFilter = filter as GetCartableDto;
    const { result, total } =
      await this.sharedCartableFilteringService.findAllForTracking(
        user,
        customFilter,
      );
    return {
      result: result,
      total: total,
    };
  }
}
