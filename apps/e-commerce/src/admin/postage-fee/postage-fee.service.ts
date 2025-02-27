import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { ECPostageFee } from '@rahino/localdatabase/models';
import { ListFilter } from '@rahino/query-filter';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { updateAllProvincePriceDto } from './dto';

@Injectable({})
export class PostageFeeService {
  constructor(
    @InjectModel(ECPostageFee)
    private readonly repository: typeof ECPostageFee,
  ) {}
  async findAll(user: User, filter: ListFilter) {
    const queryBuilder = new QueryOptionsBuilder();
    const count = await this.repository.count(queryBuilder.build());
    const queryOptions = queryBuilder
      .attributes(['id', 'fromWeight', 'toWeight', 'allProvincePrice'])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder })
      .build();
    const result = await this.repository.findAll(queryOptions);
    return {
      result: result,
      total: count,
    };
  }

  async updateAllProvincePrice(
    id: number,
    user: User,
    dto: updateAllProvincePriceDto,
  ) {
    let findItem = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id: id }).build(),
    );
    if (!findItem) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    findItem.allProvincePrice = dto.price;
    findItem = await findItem.save();
    return {
      result: findItem,
    };
  }
}
