import { Injectable } from '@nestjs/common';
import { GetCartableDto } from '../../shared/cartable-filtering/dto';
import * as _ from 'lodash';
import { User } from '@rahino/database';
import { SharedCartableFilteringService } from '@rahino/guarantee/shared/cartable-filtering/cartable-filtering.service';

@Injectable()
export class CartableService {
  constructor(
    private readonly sharedCartableFilteringService: SharedCartableFilteringService,
  ) {}

  async findAll(user: User, filter: GetCartableDto) {
    const { result, total } = await this.sharedCartableFilteringService.findAll(
      user,
      filter,
    );
    return {
      result: result,
      total: total,
    };
  }
}
