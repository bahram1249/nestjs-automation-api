import { Injectable } from '@nestjs/common';
import { GetCartableDto } from '../../shared/cartable-filtering/dto';
import * as _ from 'lodash';
import { User } from '@rahino/database';
import { SharedCartableFilteringService } from '@rahino/guarantee/shared/cartable-filtering/cartable-filtering.service';
import { GetCartableExternalDto } from './dto';

@Injectable()
export class CartableService {
  constructor(
    private readonly sharedCartableFilteringService: SharedCartableFilteringService,
  ) {}

  async findAll(user: User, filter: GetCartableExternalDto) {
    const customFilter = filter as GetCartableDto;
    customFilter.isClientSideCartable = false;

    const { result, total } =
      await this.sharedCartableFilteringService.findAllForCurrentUser(
        user,
        customFilter,
      );
    return {
      result: result,
      total: total,
    };
  }
}
