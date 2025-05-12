import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SelectedProductItemDto, GetSelectedProductItemDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { ECSelectedProductItem } from '@rahino/localdatabase/models';
import { ECProduct } from '@rahino/localdatabase/models';
import { ECSelectedProduct } from '@rahino/localdatabase/models';
import { Attachment } from '@rahino/database';

@Injectable()
export class SelectedProductItemService {
  constructor(
    @InjectModel(ECSelectedProductItem)
    private readonly repository: typeof ECSelectedProductItem,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findAll(filter: GetSelectedProductItemDto) {
    filter.orderBy = 'selectedProductId';
    let queryBuilder = new QueryOptionsBuilder();
    if (filter.selectedProductId) {
      queryBuilder = queryBuilder.filter({
        selectedProductId: filter.selectedProductId,
      });
    }
    const count = await this.repository.count(queryBuilder.build());
    const queryOptions = queryBuilder
      .attributes(['selectedProductId', 'productId', 'createdAt', 'updatedAt'])
      .include([
        {
          attributes: ['id', 'title', 'sku', 'slug'],
          model: ECProduct,
          as: 'product',
          required: false,
          include: [
            {
              attributes: ['id', 'fileName'],
              through: {
                attributes: [],
              },
              model: Attachment,
              as: 'attachments',
              required: false,
            },
          ],
        },
        {
          attributes: ['id', 'title'],
          model: ECSelectedProduct,
          as: 'selectedProduct',
          required: false,
        },
      ])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder })
      .build();
    const result = await this.repository.findAll(queryOptions);
    return {
      result: result,
      total: count,
    };
  }

  async create(dto: SelectedProductItemDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ selectedProductId: dto.selectedProductId })
        .filter({ productId: dto.productId })
        .build(),
    );
    if (item) {
      throw new BadRequestException(
        'the item with this given id is exists before !',
      );
    }

    // const mappedItem = this.mapper.map(
    //   dto,
    //   SelectedProductItemDto,
    //   ECSelectedProductItem,
    // );
    //console.log(mappedItem);
    const result = await this.repository.create(_.omit(dto, ['id']));
    return {
      result: _.pick(result, [
        'selectedProductId',
        'productId',
        'createdAt',
        'updatedAt',
      ]),
    };
  }

  async deleteItem(dto: SelectedProductItemDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ selectedProductId: dto.selectedProductId })
        .filter({ productId: dto.productId })
        .build(),
    );
    if (!item) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    await item.destroy();
    return {
      result: _.pick(item, [
        'selectedProductId',
        'productId',
        'createdAt',
        'updatedAt',
      ]),
    };
  }
}
