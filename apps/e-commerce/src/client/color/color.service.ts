import { Injectable, NotFoundException } from '@nestjs/common';
import { ColorDto, GetColorDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { ECColor } from '@rahino/localdatabase/models';

@Injectable()
export class ColorService {
  constructor(
    @InjectModel(ECColor) private repository: typeof ECColor,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findAll(filter: GetColorDto) {
    let queryBuilder = new QueryOptionsBuilder()
      .filter({
        name: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECColor.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );
    if (filter.entityTypeId) {
      queryBuilder = queryBuilder.filter(
        Sequelize.literal(`EXISTS (
        SELECT 1
        FROM ECProducts ECP
        LEFT JOIN ECInventories ECI
        ON ECP.id = ECI.productId
        WHERE ECP.entityTypeId = ${filter.entityTypeId}
          AND ISNULL(ECP.isDeleted, 0) = 0
          AND ISNULL(ECI.isDeleted, 0) = 0
          AND ECI.colorId = ECColor.id
      )`),
      );
    }
    const count = await this.repository.count(queryBuilder.build());
    const queryOptions = queryBuilder
      .attributes(['id', 'name', 'hexCode'])
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

  async findById(entityId: number) {
    const color = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes(['id', 'name', 'hexCode'])
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!color) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    return {
      result: color,
    };
  }

  async create(dto: ColorDto) {
    const mappedItem = this.mapper.map(dto, ColorDto, ECColor);
    const result = await this.repository.create(
      _.omit(mappedItem.toJSON(), ['id']),
    );
    return {
      result: _.pick(result, ['id', 'name', 'hexCode']),
    };
  }

  async update(entityId: number, dto: ColorDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException('the item with this given id not founded!');
    }

    const mappedItem = this.mapper.map(dto, ColorDto, ECColor);
    const result = await this.repository.update(
      _.omit(mappedItem.toJSON(), ['id']),
      {
        where: {
          id: entityId,
        },
        returning: true,
      },
    );
    return {
      result: _.pick(result[1][0], ['id', 'name', 'hexCode']),
    };
  }

  async deleteById(entityId: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    item.isDeleted = true;
    await item.save();
    return {
      result: _.pick(item, ['id', 'name', 'hexCode']),
    };
  }
}
