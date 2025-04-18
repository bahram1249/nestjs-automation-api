import { Injectable } from '@nestjs/common';
import { GetTransactionDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { GSTransaction } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { User } from '@rahino/database';

@Injectable()
export class GSTransactionService {
  constructor(
    @InjectModel(GSTransaction)
    private readonly repository: typeof GSTransaction,
  ) {}

  async findAll(user: User, filter: GetTransactionDto) {
    let query = new QueryOptionsBuilder().filter({
      userId: user.id,
    });

    const count = await this.repository.count(query.build());

    query = query
      .attributes([
        'id',
        'totalPrice',
        'transactionStatusId',
        'factorId',
        'createdAt',
        'updatedAt',
      ])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const results = await this.repository.findAll(query.build());

    return {
      result: results,
      total: count,
    };
  }

  async findOne(user: User, id: bigint) {
    let query = new QueryOptionsBuilder()
      .filter({
        userId: user.id,
      })
      .filter({ id: id });

    query = query.attributes([
      'id',
      'totalPrice',
      'transactionStatusId',
      'factorId',
      'createdAt',
      'updatedAt',
    ]);

    const result = await this.repository.findOne(query.build());

    return {
      result: result,
    };
  }
}
