import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { GetRewardRuleDto, RewardRuleDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import {
  GSRewardRule,
  GSUnitPrice,
  GSVipBundleType,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { LocalizationService } from 'apps/main/src/common/localization';
import { GSUnitPriceEnum } from '@rahino/guarantee/shared/unit-price';
import { VipBundleTypeService } from '../vip-bundle-types/vip-bundle-type.service';

@Injectable()
export class RewardRuleService {
  constructor(
    @InjectModel(GSRewardRule)
    private readonly repository: typeof GSRewardRule,
    @InjectModel(GSVipBundleType)
    private readonly vipBundleTypeRepository: typeof GSVipBundleType,
    private readonly localizationService: LocalizationService,
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly vipBundleTypeService: VipBundleTypeService,
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

    const vipBundleType = await this.vipBundleTypeRepository.create({
      title: `${mappedItem.title} - VIP Bundle`,
      price: mappedItem.rewardAmount,
      fee: 0n,
      monthPeriod: mappedItem.monthPeriod || 12,
      cardColor: '#1ec700ff',
      unitPriceId: GSUnitPriceEnum.Toman,
      isSystemGenerated: true,
    });

    mappedItem.vipBundleTypeId = vipBundleType.id;
    const insertedItem = _.omit(mappedItem.toJSON(), ['id']);

    const result = await this.repository.create(insertedItem);

    return {
      result: result,
    };
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
