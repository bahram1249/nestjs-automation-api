import { Injectable } from '@nestjs/common';
import {
  GetCartableDto,
  RequestCurrentStateFilterDto,
  RequestCurrentStateOutputDto,
} from '../../shared/cartable-filtering/dto';
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

  async findCurrentStates(
    user: User,
    filter: RequestCurrentStateFilterDto,
  ): Promise<{ result: RequestCurrentStateOutputDto[] }> {
    const results = await this.sharedCartableFilteringService.findCurrentStates(
      user,
      filter,
    );
    return {
      result: results,
    };
  }
}
