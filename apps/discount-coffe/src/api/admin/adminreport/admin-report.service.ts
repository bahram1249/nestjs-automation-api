import { Injectable } from '@nestjs/common';
import { ListFilter } from '@rahino/query-filter';
import { User } from '@rahino/database/models/core/user.entity';
import * as _ from 'lodash';

@Injectable()
export class AdminReportService {
  constructor() {}

  async findAll(user: User, filter: ListFilter) {
    return {
      result: null,
      total: null,
    };
  }
}
