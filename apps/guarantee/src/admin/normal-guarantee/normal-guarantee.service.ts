import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetNoramlGuaranteeDto, NoramlGuaranteeDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import {
  GSAssignedGuarantee,
  GSBrand,
  GSGuarantee,
  GSGuaranteeConfirmStatus,
  GSGuaranteePeriod,
  GSGuaranteeType,
  GSProductType,
  GSProvider,
  GSVariant,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { GSGuaranteeTypeEnum } from '../../shared/gurantee-type';

@Injectable()
export class NormalGuaranteeService {
  constructor(
    @InjectModel(GSGuarantee)
    private readonly repository: typeof GSGuarantee,
    private readonly i18n: I18nService<I18nTranslations>,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  async findAll(filter: GetNoramlGuaranteeDto) {
    let query = new QueryOptionsBuilder().filter({
      serialNumber: {
        [Op.like]: filter.search,
      },
    });

    const count = await this.repository.count(query.build());

    query = query
      .attributes([
        'id',
        'providerId',
        'brandId',
        'guaranteeTypeId',
        'guaranteePeriodId',
        'guaranteeConfirmStatusId',
        'prefixSerial',
        'serialNumber',
        'startDate',
        'endDate',
        'allowedDateEnterProduct',
        'variantId',
        'productTypeId',
        'description',
        'createdAt',
        'updatedAt',
      ])
      .include([
        {
          model: GSProvider,
          as: 'provider',
          required: false,
        },
        {
          model: GSBrand,
          as: 'brand',
          required: false,
        },
        {
          model: GSGuaranteeType,
          as: 'guaranteeType',
          required: false,
        },
        {
          model: GSGuaranteePeriod,
          as: 'guaranteePeriod',
          required: false,
        },
        {
          model: GSGuaranteeConfirmStatus,
          as: 'guaranteeConfirmStatus',
          required: false,
        },
        {
          model: GSVariant,
          as: 'variant',
          required: false,
        },
        {
          model: GSProductType,
          as: 'productType',
        },
        {
          model: GSAssignedGuarantee,
          as: 'assignedGuarantee',
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              attributes: [
                'id',
                'firstname',
                'lastname',
                'username',
                'phoneNumber',
              ],
            },
          ],
        },
      ])
      .filter({ guaranteeTypeId: GSGuaranteeTypeEnum.Normal })
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
          'providerId',
          'brandId',
          'guaranteeTypeId',
          'guaranteePeriodId',
          'guaranteeConfirmStatusId',
          'prefixSerial',
          'serialNumber',
          'startDate',
          'endDate',
          'allowedDateEnterProduct',
          'variantId',
          'productTypeId',
          'description',
          'createdAt',
          'updatedAt',
        ])
        .include([
          {
            model: GSProvider,
            as: 'provider',
            required: false,
          },
          {
            model: GSBrand,
            as: 'brand',
            required: false,
          },
          {
            model: GSGuaranteeType,
            as: 'guaranteeType',
            required: false,
          },
          {
            model: GSGuaranteePeriod,
            as: 'guaranteePeriod',
            required: false,
          },
          {
            model: GSGuaranteeConfirmStatus,
            as: 'guaranteeConfirmStatus',
            required: false,
          },
          {
            model: GSVariant,
            as: 'variant',
            required: false,
          },
          {
            model: GSProductType,
            as: 'productType',
          },
          {
            model: GSAssignedGuarantee,
            as: 'assignedGuarantee',
            required: false,
            include: [
              {
                model: User,
                as: 'user',
                attributes: [
                  'id',
                  'firstname',
                  'lastname',
                  'username',
                  'phoneNumber',
                ],
              },
            ],
          },
        ])
        .filter({ guaranteeTypeId: GSGuaranteeTypeEnum.Normal })
        .filter({ id: entityId })
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    return {
      result: item,
    };
  }

  async create(dto: NoramlGuaranteeDto) {
    const duplicateItem = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ title: dto.serialNumber })
        .filter({ guaranteeTypeId: GSGuaranteeTypeEnum.Normal })
        .build(),
    );
    if (duplicateItem) {
      throw new BadRequestException(
        this.i18n.t('core.item_exists', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const mappedItem = this.mapper.map(dto, NoramlGuaranteeDto, GSGuarantee);
    const result = await this.repository.create(
      _.omit(mappedItem.toJSON(), ['id']),
    );

    return {
      result: result,
    };
  }

  async updateById(id: number, dto: NoramlGuaranteeDto) {
    const updatedItem = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: id })
        .filter({ guaranteeTypeId: GSGuaranteeTypeEnum.Normal })
        .build(),
    );

    if (!updatedItem) {
      throw new BadRequestException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const duplicateItem = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ title: dto.serialNumber })
        .filter({
          id: {
            [Op.ne]: id,
          },
        })
        .build(),
    );

    if (duplicateItem) {
      throw new BadRequestException(
        this.i18n.t('core.item_exists', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const mappedItem = this.mapper.map(dto, NoramlGuaranteeDto, GSGuarantee);
    await this.repository.update(_.omit(mappedItem.toJSON(), ['id']), {
      where: {
        id: id,
      },
    });

    return await this.findById(id);
  }

  async deleteById(entityId: number) {
    throw new Error('Method not implemented.');
  }
}
