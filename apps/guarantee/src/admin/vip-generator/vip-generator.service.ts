import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetVipGeneratorDto, VipGeneratorDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { GSVipBundleType, GSVipGenerator } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import { LocalizationService } from 'apps/main/src/common/localization';
import { User } from '@rahino/database';
import { VIP_GENERATOR_QUEUE } from '@rahino/guarantee/job/vip-generator-job/constants';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class VipGeneratorService {
  constructor(
    @InjectModel(GSVipGenerator)
    private readonly repository: typeof GSVipGenerator,
    @InjectModel(GSVipBundleType)
    private readonly vipBundleTypeRepository: typeof GSVipBundleType,
    private readonly localizationService: LocalizationService,
    @InjectQueue(VIP_GENERATOR_QUEUE)
    private readonly vipGeneratorQueue: Queue,
  ) {}

  async findAll(filter: GetVipGeneratorDto) {
    let query = new QueryOptionsBuilder().filter({
      title: {
        [Op.like]: filter.search,
      },
    });

    const count = await this.repository.count(query.build());

    query = query
      .attributes([
        'id',
        'title',
        'price',
        'fee',
        'isCompleted',
        'qty',
        'createdAt',
        'updatedAt',
      ])
      .include([
        {
          model: GSVipBundleType,
          as: 'vipBundleType',
          attributes: ['id', 'title', 'cardColor', 'monthPeriod'],
        },
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
          'isCompleted',
          'qty',
          'createdAt',
          'updatedAt',
        ])
        .include([
          {
            model: GSVipBundleType,
            as: 'vipBundleType',
            attributes: ['id', 'title', 'cardColor', 'monthPeriod'],
          },
        ])
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

  async create(user: User, dto: VipGeneratorDto) {
    const vipBundleTypeItem = await this.vipBundleTypeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.vipBundleTypeId })
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

    if (!vipBundleTypeItem) {
      throw new BadRequestException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    const result = await this.repository.create({
      vipBundleTypeId: vipBundleTypeItem.id,
      qty: dto.qty,
      title: dto.title,
      price: vipBundleTypeItem.price,
      fee: vipBundleTypeItem.fee,
      isCompleted: false,
      userId: user.id,
    });

    await this.vipGeneratorQueue.add('vip-card-generator-job', {
      vipGeneratorId: result.id,
    });

    return {
      result: result,
    };
  }
}
