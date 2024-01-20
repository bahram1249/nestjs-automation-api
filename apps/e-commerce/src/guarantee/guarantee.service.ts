import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GuaranteeDto, GetGuaranteeDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { ECGuarantee } from '@rahino/database/models/ecommerce-eav/ec-guarantee.entity';

@Injectable()
export class GuaranteeService {
  constructor(
    @InjectModel(ECGuarantee) private repository: typeof ECGuarantee,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findAll(filter: GetGuaranteeDto) {
    const queryBuilder = new QueryOptionsBuilder()
      .filter({
        name: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0), {
          [Op.eq]: 0,
        }),
      );
    const count = await this.repository.count(queryBuilder.build());
    const queryOptions = queryBuilder
      .attributes(['id', 'name', 'slug', 'description'])
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
    const guarantee = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes(['id', 'name', 'slug', 'description'])
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
    if (!guarantee) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    return {
      result: guarantee,
    };
  }

  async create(dto: GuaranteeDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ slug: dto.slug })
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
    if (item) {
      throw new BadRequestException(
        'the item with this slug is exists before !',
      );
    }

    const mappedItem = this.mapper.map(dto, GuaranteeDto, ECGuarantee);
    const result = await this.repository.create(
      _.omit(mappedItem.toJSON(), ['id']),
    );
    return {
      result: _.pick(result, ['id', 'name', 'slug', 'description']),
    };
  }

  async update(entityId: number, dto: GuaranteeDto) {
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
    const searchSlug = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ slug: dto.slug })
        .filter({
          id: {
            [Op.ne]: entityId,
          },
        })
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
    if (searchSlug) {
      throw new BadRequestException(
        'the item with this slug is exists before !',
      );
    }
    const mappedItem = this.mapper.map(dto, GuaranteeDto, ECGuarantee);
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
      result: _.pick(result[1][0], ['id', 'name', 'slug', 'description']),
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
      result: _.pick(item, ['id', 'name', 'slug', 'description']),
    };
  }

  async findBySlug(slug: string) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ slug: slug })
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
      throw new NotFoundException('the item with this given slug not founded!');
    }
    return {
      result: _.pick(item, ['id', 'name', 'slug', 'description']),
    };
  }
}
