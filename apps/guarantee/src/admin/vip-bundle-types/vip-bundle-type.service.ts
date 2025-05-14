import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetVipBundleTypeDto, VipBundleTypeDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { GSVipBundleType } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { GSUnitPriceEnum } from '@rahino/guarantee/shared/unit-price';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class VipBundleTypeService {
  constructor(
    @InjectModel(GSVipBundleType)
    private readonly repository: typeof GSVipBundleType,
    private readonly localizationService: LocalizationService,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  async findAll(filter: GetVipBundleTypeDto) {
    let query = new QueryOptionsBuilder()
      .filter({
        title: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('GSVipBundleType.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );

    const count = await this.repository.count(query.build());

    query = query
      .attributes([
        'id',
        'title',
        'price',
        'fee',
        'monthPeriod',
        'cardColor',
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

  async findById(entityId: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'title',
          'price',
          'fee',
          'monthPeriod',
          'cardColor',
          'createdAt',
          'updatedAt',
        ])
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSVipBundleType.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ id: entityId })
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    return {
      result: item,
    };
  }

  async create(dto: VipBundleTypeDto) {
    const duplicateItem = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSVipBundleType.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ title: dto.title })
        .build(),
    );
    if (duplicateItem) {
      throw new BadRequestException(
        this.localizationService.translate('core.item_exists'),
      );
    }

    const mappedItem = this.mapper.map(dto, VipBundleTypeDto, GSVipBundleType);
    const insertedItem = _.omit(mappedItem.toJSON(), ['id']);
    insertedItem.unitPriceId = GSUnitPriceEnum.Toman;

    const result = await this.repository.create(insertedItem);

    return {
      result: result,
    };
  }

  async updateById(id: number, dto: VipBundleTypeDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: id })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSVipBundleType.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );

    if (!item) {
      throw new BadRequestException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    const duplicateItem = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSVipBundleType.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ title: dto.title })
        .filter({
          id: {
            [Op.ne]: id,
          },
        })
        .build(),
    );
    if (duplicateItem) {
      throw new BadRequestException(
        this.localizationService.translate('core.item_exists'),
      );
    }

    const mappedItem = this.mapper.map(dto, VipBundleTypeDto, GSVipBundleType);
    const updatedItem = _.omit(mappedItem.toJSON(), ['id']);
    updatedItem.unitPriceId = GSUnitPriceEnum.Toman;
    await this.repository.update(updatedItem, {
      where: {
        id: id,
      },
    });

    return await this.findById(id);
  }

  async deleteById(entityId: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSVipBundleType.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new BadRequestException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    item.isDeleted = true;
    await item.save();
    return {
      result: _.pick(item, [
        'id',
        'title',
        'price',
        'fee',
        'cardColor',
        'monthPeriod',
        'createdAt',
        'updatedAt',
      ]),
    };
  }
}
