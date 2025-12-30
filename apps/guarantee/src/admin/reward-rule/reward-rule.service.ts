import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { GetRewardRuleDto, RewardRuleDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { GSRewardRule, GSUnitPrice } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { LocalizationService } from 'apps/main/src/common/localization';
import { GSUnitPriceEnum } from '@rahino/guarantee/shared/unit-price';

@Injectable()
export class RewardRuleService {
  constructor(
    @InjectModel(GSRewardRule)
    private readonly repository: typeof GSRewardRule,
    private readonly localizationService: LocalizationService,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  async findAll(filter: GetRewardRuleDto) {
    let query = new QueryOptionsBuilder()
      .filter({
        title: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('GSRewardRules.isDeleted'), 0),
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
        'rewardAmount',
        'unitPriceId',
        'validFrom',
        'validUntil',
        'isActive',
        'description',
        'createdAt',
        'updatedAt',
      ])
      .include([{ model: GSUnitPrice, as: 'unitPrice' }])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const results = await this.repository.findAll(query.build());

    return {
      result: results,
      total: count,
    };
  }

  async findById(entityId: bigint) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'title',
          'rewardAmount',
          'unitPriceId',
          'validFrom',
          'validUntil',
          'isActive',
          'description',
          'createdAt',
          'updatedAt',
        ])
        .include([{ model: GSUnitPrice, as: 'unitPrice' }])
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSRewardRules.isDeleted'), 0),
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

  async create(dto: RewardRuleDto) {
    const mappedItem = this.mapper.map(dto, RewardRuleDto, GSRewardRule);

    mappedItem.unitPriceId = GSUnitPriceEnum.Toman;
    const insertedItem = _.omit(mappedItem.toJSON(), ['id']);

    const result = await this.repository.create(insertedItem);

    return {
      result: result,
    };
  }

  async updateById(id: bigint, dto: RewardRuleDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSRewardRules.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ id: id })
        .build(),
    );

    if (!item) {
      throw new BadRequestException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    const mappedItem = this.mapper.map(dto, RewardRuleDto, GSRewardRule);
    const updatedItem = _.omit(mappedItem.toJSON(), ['id']);

    await this.repository.update(updatedItem, { where: { id } });

    return await this.findById(id);
  }

  async deleteById(entityId: bigint) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSRewardRules.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ id: entityId })
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
        'rewardAmount',
        'unitPriceId',
        'validFrom',
        'validUntil',
        'isActive',
        'description',
        'createdAt',
        'updatedAt',
      ]),
    };
  }

  // async getActiveRewardRule(): Promise<GSRewardRule | null> {
  //   const now = new Date();

  //   const rewardRule = await this.repository.findOne({
  //     where: {
  //       isActive: true,
  //       isDeleted: false,
  //       [Op.or]: [
  //         { validFrom: null, validUntil: null },
  //         { validFrom: { [Op.lte]: now }, validUntil: { [Op.gte]: now } },
  //       ],
  //     },
  //     include: ['vipBundleType'],
  //     order: [['createdAt', 'DESC']],
  //   });

  //   return rewardRule;
  // }

  // async checkAndGrantWarrantyReward(
  //   guaranteeId: bigint,
  //   transaction?: Transaction,
  // ): Promise<GSRewardRule | null> {
  //   const existingReward = await this.warrantyRewardRepository.findOne({
  //     where: { guaranteeId },
  //   });

  //   if (existingReward) {
  //     return null;
  //   }

  //   const rewardRule = await this.getActiveRewardRule();

  //   if (!rewardRule) {
  //     return null;
  //   }

  //   await this.warrantyRewardRepository.create(
  //     {
  //       guaranteeId,
  //       rewardRuleId: rewardRule.id,
  //     },
  //     { transaction },
  //   );

  //   return rewardRule;
  // }
}
